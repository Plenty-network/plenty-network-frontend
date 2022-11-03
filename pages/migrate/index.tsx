import Image from "next/image";
import PropTypes from "prop-types";
import * as React from "react";
import { BigNumber } from "bignumber.js";
import "animate.css";
import playIcon from "../../src/assets/icon/pools/playIcon.svg";
import { useEffect, useState, useMemo } from "react";
import { SideBarHOC } from "../../src/components/Sidebar/SideBarHOC";
import { connect, useDispatch } from "react-redux";
import { AppDispatch, store, useAppSelector } from "../../src/redux";
import { fetchWallet } from "../../src/redux/wallet/wallet";
import { createGaugeConfig, getConfig } from "../../src/redux/config/config";
import { getLpTokenPrice, getTokenPrice } from "../../src/redux/tokenPrice/tokenPrice";
import { getTotalVotingPower } from "../../src/redux/pools";
import { getEpochData } from "../../src/redux/epoch/epoch";
import { useInterval } from "../../src/hooks/useInterval";

import rewardsViolet from "../../src/assets/icon/myPortfolio/rewardsViolet.svg";
import positionsViolet from "../../src/assets/icon/myPortfolio/positionsViolet.svg";
import migrateViolet from "../../src/assets/icon/migrate/migrateViolet.svg";

import migrateGrey from "../../src/assets/icon/migrate/migrateGrey.svg";
import rewards from "../../src/assets/icon/myPortfolio/rewards.svg";
import position from "../../src/assets/icon/myPortfolio/positions.svg";

import clsx from "clsx";
import { setMyPortfolioSection } from "../../src/redux/walletLoading";

import {
  fetchAllLocksRewardsData,
  fetchAllRewardsOperationsData,
  fetchUnclaimedInflationData,
} from "../../src/redux/myPortfolio/rewards";
import { API_RE_ATTAMPT_DELAY } from "../../src/constants/global";
import { USERADDRESS } from "../../src/constants/localStorage";
import { Position, ToolTip } from "../../src/components/Tooltip/TooltipAdvanced";
import { fetchTvlStatsData } from "../../src/redux/myPortfolio/tvl";
import { fetchVotesStatsData } from "../../src/redux/myPortfolio/votesStats";
import { VideoModal } from "../../src/components/Modal/videoModal";
import { isMobile } from "react-device-detect";
import { PortfolioDropdown } from "../../src/components/PortfolioSection";
import Migrate from "../../src/components/Migrate";
import { VestedPlyTopbar } from "../../src/components/Migrate/VestedPlyTopBar";
import ClaimVested from "../../src/components/Migrate/ClaimVested";

import { useRouter } from "next/router";
import { getUserClaimAndVestAmount } from "../../src/api/migrate";
import { IVestAndClaim } from "../../src/api/migrate/types";
import { getCompleteUserBalace } from "../../src/api/util/balance";
import { IAllBalanceResponse } from "../../src/api/util/types";
import { MigrateToken } from "../../src/config/types";
import { useCountdown } from "../../src/hooks/useCountDown";

export enum MyPortfolioSection {
  Positions = "Positions",
  Rewards = "Rewards",
  Migrate = "Migrate",
}
function MyPortfolio(props: any) {
  const section = useAppSelector((state) => state.walletLoading.activePortfolio);
  const [activeSection, setActiveSection] = React.useState<MyPortfolioSection>(
    MyPortfolioSection.Migrate
  );

  const userAddress = useAppSelector((state) => state.wallet.address);

  const dispatch = useDispatch<AppDispatch>();

  const token = useAppSelector((state) => state.config.tokens);
  const totalVotingPowerError = useAppSelector((state) => state.pools.totalVotingPowerError);
  const epochError = useAppSelector((state) => state.epoch).epochFetchError;
  const amm = useAppSelector((state) => state.config.AMMs);
  const tokenPrice = useAppSelector((state) => state.tokenPrice.tokenPrice);
  const lpTokenPrice = useAppSelector((state) => state.tokenPrice.lpTokenPrices);
  const statsVotesError: boolean = useAppSelector(
    (state) => state.portfolioStatsVotes.votesStatsError
  );
  const locksRewardsDataError = useAppSelector(
    (state) => state.portfolioRewards.locksRewardsDataError
  );
  const rewardsOperationDataError = useAppSelector(
    (state) => state.portfolioRewards.rewardsOperationDataError
  );
  const unclaimedInflationDataError = useAppSelector(
    (state) => state.portfolioRewards.unclaimedInflationDataError
  );
  const statsTvlError: boolean = useAppSelector((state) => state.portfolioStatsTvl.userTvlError);
  const [allBalance, setAllBalance] = useState<{
    success: boolean;
    userBalance: { [id: string]: BigNumber };
  }>({ success: false, userBalance: {} });
  useEffect(() => {
    setAllBalance({ success: false, userBalance: {} });
    if (userAddress) {
      getCompleteUserBalace(userAddress).then((response: IAllBalanceResponse) => {
        setAllBalance(response);
      });
    } else {
      setAllBalance({ success: true, userBalance: {} });
    }
  }, [userAddress, token, props.operationSuccesful]);

  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(getConfig());
  }, []);
  useEffect(() => {
    if (epochError) {
      dispatch(getEpochData());
    }
  }, [epochError]);
  useInterval(() => {
    dispatch(getEpochData());
  }, 60000);
  useEffect(() => {
    if (userAddress) {
      dispatch(getTotalVotingPower());
    }
  }, [userAddress]);
  useEffect(() => {
    if (userAddress && totalVotingPowerError) {
      dispatch(getTotalVotingPower());
    }
  }, [totalVotingPowerError]);
  useEffect(() => {
    Object.keys(token).length !== 0 && dispatch(getTokenPrice());
  }, [token]);
  useEffect(() => {
    Object.keys(tokenPrice).length !== 0 && dispatch(getLpTokenPrice(tokenPrice));
  }, [tokenPrice]);
  useEffect(() => {
    Object.keys(amm).length !== 0 && dispatch(createGaugeConfig());
  }, [amm]);
  useEffect(() => {
    if (userAddress && Object.keys(tokenPrice).length !== 0) {
      dispatch(
        fetchAllLocksRewardsData({ userTezosAddress: userAddress, tokenPrices: tokenPrice })
      );
      dispatch(fetchAllRewardsOperationsData(userAddress));
      dispatch(
        fetchUnclaimedInflationData({ userTezosAddress: userAddress, tokenPrices: tokenPrice })
      );
    }
  }, [userAddress, tokenPrice]);
  useEffect(() => {
    if (userAddress && Object.keys(tokenPrice).length !== 0 && locksRewardsDataError) {
      setTimeout(() => {
        dispatch(
          fetchAllLocksRewardsData({ userTezosAddress: userAddress, tokenPrices: tokenPrice })
        );
      }, API_RE_ATTAMPT_DELAY);
    }
  }, [locksRewardsDataError]);
  useEffect(() => {
    if (userAddress && Object.keys(tokenPrice).length !== 0 && rewardsOperationDataError) {
      setTimeout(() => {
        dispatch(fetchAllRewardsOperationsData(userAddress));
      }, API_RE_ATTAMPT_DELAY);
    }
  }, [rewardsOperationDataError]);
  useEffect(() => {
    if (userAddress && Object.keys(tokenPrice).length !== 0 && unclaimedInflationDataError) {
      setTimeout(() => {
        dispatch(
          fetchUnclaimedInflationData({ userTezosAddress: userAddress, tokenPrices: tokenPrice })
        );
      }, API_RE_ATTAMPT_DELAY);
    }
  }, [unclaimedInflationDataError]);
  const [vestedData, setVestedData] = useState<IVestAndClaim>({} as IVestAndClaim);
  useEffect(() => {
    if (userAddress) {
      getUserClaimAndVestAmount(userAddress).then((res) => {
        console.log(res);
        setVestedData(res);
      });
      if (Object.keys(lpTokenPrice).length !== 0 && Object.keys(tokenPrice).length !== 0) {
        dispatch(
          fetchTvlStatsData({
            userTezosAddress: userAddress,
            tokenPrices: tokenPrice,
            lpTokenPrices: lpTokenPrice,
          })
        );
      }
    }
  }, [userAddress, lpTokenPrice, props.operationSuccesful]);
  const [days, hours, minutes, seconds] = useCountdown(
    props.vestedData?.nextClaim?.isGreaterThan(0)
      ? props.vestedData?.nextClaim?.toNumber()
      : Date.now()
  );
  useInterval(() => {
    if (minutes < 0 || seconds < 0) {
      if (userAddress) {
        getUserClaimAndVestAmount(userAddress).then((res) => {
          console.log(res);
          setVestedData(res);
        });
      }
    }
  }, 5000);
  useEffect(() => {
    if (
      userAddress &&
      Object.keys(tokenPrice).length !== 0 &&
      Object.keys(lpTokenPrice).length !== 0 &&
      statsTvlError
    ) {
      setTimeout(() => {
        dispatch(
          fetchTvlStatsData({
            userTezosAddress: userAddress,
            tokenPrices: tokenPrice,
            lpTokenPrices: lpTokenPrice,
          })
        );
      }, API_RE_ATTAMPT_DELAY);
    }
  }, [statsTvlError]);

  useEffect(() => {
    if (userAddress) {
      dispatch(fetchVotesStatsData(userAddress));
    }
  }, [userAddress]);
  useEffect(() => {
    if (userAddress && statsVotesError) {
      setTimeout(() => {
        dispatch(fetchVotesStatsData(userAddress));
      }, API_RE_ATTAMPT_DELAY);
    }
  }, [statsVotesError]);

  useEffect(() => {
    if (userAddress) {
      console.log(`User Add Changed - ${userAddress}`);
      if (!(localStorage.getItem(USERADDRESS) === userAddress)) {
        localStorage.setItem(USERADDRESS, userAddress);
      }
    }
  }, [userAddress]);
  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const Title = useMemo(() => {
    return (
      <div className="flex gap-1 items-center">
        <p
          className={clsx(
            " font-title3 cursor-pointer box-border py-3 w-[147px] flex items-center justify-center  gap-1",
            activeSection === MyPortfolioSection.Positions
              ? "text-primary-500 bg-primary-500/[0.1] border border-primary-500/[0.6] rounded-l-lg"
              : "text-text-250 bg-muted-700 rounded-l-lg"
          )}
          onClick={() => {
            setActiveSection(MyPortfolioSection.Positions);
            dispatch(setMyPortfolioSection(MyPortfolioSection.Positions));
          }}
        >
          Positions{" "}
          {activeSection === MyPortfolioSection.Positions ? (
            <Image alt={"alt"} src={positionsViolet} />
          ) : (
            <Image alt={"alt"} src={position} />
          )}
        </p>
        <p
          className={clsx(
            " cursor-pointer font-title3 py-3 box-border  w-[147px] flex items-center justify-center  gap-1",
            activeSection === MyPortfolioSection.Rewards
              ? "text-primary-500 bg-primary-500/[0.1] border border-primary-500/[0.6]"
              : "text-text-250 bg-muted-700 "
          )}
          onClick={() => {
            setActiveSection(MyPortfolioSection.Rewards);
            dispatch(setMyPortfolioSection(MyPortfolioSection.Rewards));
          }}
        >
          Rewards
          {activeSection === MyPortfolioSection.Rewards ? (
            <Image alt={"alt"} src={rewardsViolet} />
          ) : (
            <Image alt={"alt"} src={rewards} />
          )}
        </p>
        <p
          className={clsx(
            " font-title3 cursor-pointer box-border py-3 w-[147px] flex items-center justify-center  gap-1",
            activeSection === MyPortfolioSection.Migrate
              ? "text-primary-500 bg-primary-500/[0.1] border border-primary-500/[0.6] rounded-r-lg"
              : "text-text-250 bg-muted-700 rounded-r-lg"
          )}
          onClick={() => {
            setActiveSection(MyPortfolioSection.Migrate);
            dispatch(setMyPortfolioSection(MyPortfolioSection.Migrate));
          }}
        >
          Migrate{" "}
          {activeSection === MyPortfolioSection.Migrate ? (
            <Image alt={"alt"} src={migrateViolet} />
          ) : (
            <Image alt={"alt"} src={migrateGrey} />
          )}
        </p>
      </div>
    );
  }, [activeSection]);

  const Tooltip = useMemo(() => {
    return (
      <p className="ml-2">
        <ToolTip
          classNameToolTipContainer={isMobile ? `playIconTooltip-left` : `playIconTooltip-right`}
          position={isMobile ? Position.bottom : Position.right}
          toolTipChild={
            props.toolTipContent ? (
              <p className="">{props.toolTipContent}</p>
            ) : (
              <p className="w-[200px] md:min-w-[320px]">
                Watch how to add liquidity, stake, and earn PLY
              </p>
            )
          }
          classNameAncorToolTip="pushtoCenter"
          isShowInnitially={
            userAddress !== null && localStorage.getItem(USERADDRESS) !== userAddress
          }
        >
          <Image
            src={playIcon}
            onClick={() => setShowVideoModal(true)}
            height={"28px"}
            width={"28px"}
            className="cursor-pointer hover:opacity-90"
          />
        </ToolTip>
      </p>
    );
  }, []);

  const router = useRouter();
  useEffect(() => {
    if (activeSection === MyPortfolioSection.Migrate) {
      void router.replace(
        {
          pathname: "/migrate",
        },
        undefined,
        { shallow: true }
      );
    } else {
      void router.replace(
        {
          pathname: "/myportfolio",
        },
        undefined,
        { shallow: true }
      );
    }
  }, [activeSection]);
  const [showMigrateSwap, setShowMigrateSwap] = useState(true);

  const [showTopBar, setShowTopBar] = useState(false);
  useEffect(() => {
    if (
      (allBalance.userBalance[MigrateToken.PLENTY]?.toNumber() !== 0 ||
        allBalance.userBalance[MigrateToken.WRAP]?.toNumber() !== 0) &&
      vestedData.claimableAmount?.toNumber() === 0
    ) {
      setShowMigrateSwap(true);
      setIsClaimVested(false);
      setShowTopBar(false);
    } else if (
      (allBalance.userBalance[MigrateToken.PLENTY]?.toNumber() !== 0 ||
        allBalance.userBalance[MigrateToken.WRAP]?.toNumber() !== 0) &&
      vestedData.claimableAmount?.toNumber() !== 0
    ) {
      setShowTopBar(true);
      setShowMigrateSwap(true);
      setIsClaimVested(false);
    } else if (
      allBalance.userBalance[MigrateToken.PLENTY].toNumber() === 0 &&
      allBalance.userBalance[MigrateToken.WRAP].toNumber() === 0 &&
      vestedData.claimableAmount?.toNumber() !== 0
    ) {
      setIsClaimVested(true);
      setShowTopBar(false);
      setShowMigrateSwap(false);
    } else if (
      allBalance.userBalance[MigrateToken.PLENTY]?.toNumber() === 0 &&
      allBalance.userBalance[MigrateToken.WRAP]?.toNumber() === 0 &&
      vestedData.claimableAmount?.toNumber() === 0
    ) {
      setIsClaimVested(false);
      setShowTopBar(false);
      setShowMigrateSwap(true);
    }
  }, [
    allBalance.userBalance[MigrateToken.PLENTY],
    allBalance.userBalance[MigrateToken.WRAP],
    vestedData.claimableAmount,
    props.operationSuccesful,
    userAddress,
  ]);

  const [isClaimVested, setIsClaimVested] = useState(false);
  return (
    <>
      <SideBarHOC>
        <div>
          <div className="   ">
            <div className="flex items-center bg-background-200 h-[97px] border-b border-text-800/[0.5] md:pl-[23px] md:pr-0 px-2">
              {isMobile ? (
                <PortfolioDropdown
                  Options={["Positions", "Rewards", "Migrate"]}
                  onClick={setActiveSection}
                  selectedText={activeSection}
                />
              ) : (
                <div className=""> {Title}</div>
              )}
              {Tooltip}
              {!isMobile && showTopBar && (
                <VestedPlyTopbar
                  value={new BigNumber(12)}
                  isLoading={false}
                  vestedData={vestedData}
                  onClick={setIsClaimVested}
                />
              )}
            </div>
          </div>
          {isMobile && showTopBar && (
            <VestedPlyTopbar
              value={new BigNumber(12)}
              isLoading={false}
              vestedData={vestedData}
              onClick={setIsClaimVested}
            />
          )}

          {activeSection !== MyPortfolioSection.Migrate && (
            <div className="border-t border-text-800/[0.5] mt-5"></div>
          )}
          {activeSection === MyPortfolioSection.Migrate && isClaimVested && (
            <ClaimVested vestedData={vestedData} />
          )}
          {activeSection === MyPortfolioSection.Migrate && showMigrateSwap && (
            <Migrate allBalance={allBalance} />
          )}
        </div>
      </SideBarHOC>

      {showVideoModal && <VideoModal closefn={setShowVideoModal} linkString={"UXBs3vi26_A"} />}
    </>
  );
}

MyPortfolio.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  operationSuccesful: PropTypes.bool.isRequired,
};
function mapStateToProps(
  state: { walletLoading: { isLoading: boolean; operationSuccesful: boolean } },
  ownProps: any
) {
  return {
    isLoading: state.walletLoading.isLoading,
    operationSuccesful: state.walletLoading.operationSuccesful,
  };
}

export default connect(mapStateToProps)(MyPortfolio);

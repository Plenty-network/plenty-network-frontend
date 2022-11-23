import Image from "next/image";
import PropTypes from "prop-types";
import * as React from "react";
import { BigNumber } from "bignumber.js";
import "animate.css";
import playIcon from "../../src/assets/icon/pools/playIcon.svg";
import { useEffect, useState, useMemo, useRef } from "react";
import { SideBarHOC } from "../../src/components/Sidebar/SideBarHOC";
import { connect, useDispatch } from "react-redux";
import { AppDispatch, store, useAppSelector } from "../../src/redux";
import { fetchWallet } from "../../src/redux/wallet/wallet";
import { createGaugeConfig, getConfig } from "../../src/redux/config/config";
import { getLpTokenPrice, getTokenPrice } from "../../src/redux/tokenPrice/tokenPrice";
import { getTotalVotingPower } from "../../src/redux/pools";
import { getEpochData } from "../../src/redux/epoch/epoch";
import { useInterval } from "../../src/hooks/useInterval";

import {
  fetchAllLocksRewardsData,
  fetchAllRewardsOperationsData,
  fetchUnclaimedInflationData,
} from "../../src/redux/myPortfolio/rewards";
import { API_RE_ATTAMPT_DELAY } from "../../src/constants/global";
import { fetchTvlStatsData } from "../../src/redux/myPortfolio/tvl";
import { fetchVotesStatsData } from "../../src/redux/myPortfolio/votesStats";
import { isMobile } from "react-device-detect";
import Migrate from "../../src/components/Migrate";
import { VestedPlyTopbar } from "../../src/components/Migrate/VestedPlyTopBar";
import ClaimVested from "../../src/components/Migrate/ClaimVested";

import { useRouter } from "next/router";
import { getUserClaimAndVestAmount } from "../../src/api/migrate";
import { IVestAndClaim } from "../../src/api/migrate/types";
import { getAllTokensBalanceFromTzkt } from "../../src/api/util/balance";
import {
  IAllBalanceResponse,
  IAllTokensBalance,
  IAllTokensBalanceResponse,
} from "../../src/api/util/types";
import { MigrateToken } from "../../src/config/types";
import { useCountdown } from "../../src/hooks/useCountDown";

function MigrateMain(props: any) {
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
  const [allBalance, setAllBalance] = useState<IAllTokensBalanceResponse>({
    success: false,
    allTokensBalances: {} as IAllTokensBalance,
  });
  useEffect(() => {
    setAllBalance({
      success: false,
      allTokensBalances: {} as IAllTokensBalance,
    });
    if (userAddress) {
      getAllTokensBalanceFromTzkt(Object.values(token), userAddress).then(
        (response: IAllTokensBalanceResponse) => {
          setAllBalance(response);
        }
      );
    } else {
      setAllBalance({
        success: false,
        allTokensBalances: {} as IAllTokensBalance,
      });
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

  var [days, hours, minutes, seconds] = useCountdown(
    vestedData?.nextClaim?.isGreaterThan(0) ? vestedData?.nextClaim?.toNumber() : Date.now()
  );

  useInterval(() => {
    if ((minutes < 0 || seconds < 0) && !vestedData.isClaimable) {
      if (userAddress) {
        getUserClaimAndVestAmount(userAddress).then((res) => {
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

  const [showMigrateSwap, setShowMigrateSwap] = useState(true);

  const [showTopBar, setShowTopBar] = useState(false);
  useEffect(() => {
    if (userAddress) {
      if (
        (allBalance.allTokensBalances[MigrateToken.PLENTY].balance?.toNumber() !== 0 ||
          allBalance.allTokensBalances[MigrateToken.WRAP].balance?.toNumber() !== 0) &&
        vestedData.claimableAmount?.toNumber() === 0
      ) {
        setShowMigrateSwap(true);
        setIsClaimVested(false);
        setShowTopBar(false);
      } else if (
        (allBalance.allTokensBalances[MigrateToken.PLENTY].balance?.toNumber() !== 0 ||
          allBalance.allTokensBalances[MigrateToken.WRAP].balance?.toNumber() !== 0) &&
        vestedData.claimableAmount?.toNumber() !== 0
      ) {
        setShowTopBar(true);
        setShowMigrateSwap(true);
        setIsClaimVested(false);
      } else if (
        allBalance.allTokensBalances[MigrateToken.PLENTY].balance.toNumber() === 0 &&
        allBalance.allTokensBalances[MigrateToken.WRAP].balance.toNumber() === 0 &&
        vestedData.claimableAmount?.toNumber() !== 0
      ) {
        setIsClaimVested(true);
        setShowTopBar(false);
        setShowMigrateSwap(false);
      } else if (
        allBalance.allTokensBalances[MigrateToken.PLENTY].balance?.toNumber() === 0 &&
        allBalance.allTokensBalances[MigrateToken.WRAP].balance?.toNumber() === 0 &&
        vestedData.claimableAmount?.toNumber() === 0
      ) {
        setIsClaimVested(false);
        setShowTopBar(false);
        setShowMigrateSwap(true);
      }
    } else {
      setShowTopBar(false);
      setShowMigrateSwap(true);
    }
  }, [
    allBalance.allTokensBalances[MigrateToken.PLENTY],
    allBalance.allTokensBalances[MigrateToken.WRAP],
    vestedData.claimableAmount,
    props.operationSuccesful,
    userAddress,
  ]);

  const [isClaimVested, setIsClaimVested] = useState(false);
  const handleClaimClick = () => {
    setIsClaimVested(true);
    setShowMigrateSwap(false);
    setShowTopBar(false);
  };
  return (
    <>
      <SideBarHOC>
        <div>
          <div className="   ">
            <div className="bg-background-200 flex items-center h-[68px]  md:pl-[23px] md:pr-0 px-2 border-b border-b-borderCommon">
              <div className="font-title2 relative ">Migrate</div>
              {!isMobile && showTopBar && (
                <VestedPlyTopbar
                  value={new BigNumber(12)}
                  isLoading={false}
                  vestedData={vestedData}
                  onClick={handleClaimClick}
                  plentyBal={allBalance.allTokensBalances[MigrateToken.PLENTY].balance}
                  wrapBal={allBalance.allTokensBalances[MigrateToken.WRAP].balance}
                />
              )}
            </div>
          </div>
          {isMobile && showTopBar && (
            <VestedPlyTopbar
              value={new BigNumber(12)}
              isLoading={false}
              vestedData={vestedData}
              onClick={handleClaimClick}
              plentyBal={allBalance.allTokensBalances[MigrateToken.PLENTY].balance}
              wrapBal={allBalance.allTokensBalances[MigrateToken.WRAP].balance}
            />
          )}

          {isClaimVested && <ClaimVested vestedData={vestedData} />}
          {showMigrateSwap && <Migrate allBalance={allBalance} />}
        </div>
      </SideBarHOC>
    </>
  );
}

MigrateMain.propTypes = {
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

export default connect(mapStateToProps)(MigrateMain);

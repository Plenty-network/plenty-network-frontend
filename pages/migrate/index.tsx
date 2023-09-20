import Image from "next/image";
import PropTypes from "prop-types";
import * as React from "react";
import { BigNumber } from "bignumber.js";
import "animate.css";

import { useEffect, useState, useRef } from "react";
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
import { getUserClaimAndVestAmount } from "../../src/api/migrate";
import { IVestAndClaim } from "../../src/api/migrate/types";
import { getBalanceFromTzkt } from "../../src/api/util/balance";
import { MigrateToken } from "../../src/config/types";
import { useCountdown } from "../../src/hooks/useCountDown";
import { getRewardsAprEstimate } from "../../src/redux/rewardsApr";

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

  const initialPriceCall = useRef<boolean>(true);
  const initialLpPriceCall = useRef<boolean>(true);
  const initialRewardsAprCall = useRef<boolean>(true);
  const currentTotalVotingPower = useAppSelector((state) => state.pools.totalVotingPower);
  const rewardsAprEstimateError = useAppSelector(
    (state) => state.rewardsApr.rewardsAprEstimateError
  );

  const tokenIn = { symbol: "WRAP" };
  const tokenOut = { symbol: "PLENTY" };
  const [userBalances, setUserBalances] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    const updateBalance = async () => {
      const balancePromises = [];

      if (userAddress) {
        tokenIn.symbol &&
          balancePromises.push(
            getBalanceFromTzkt(
              String(token[tokenIn.symbol]?.address),
              token[tokenIn.symbol].tokenId,
              token[tokenIn.symbol].standard,
              userAddress,
              tokenIn.symbol
            )
          );
        tokenOut.symbol &&
          balancePromises.push(
            getBalanceFromTzkt(
              String(token[tokenOut.symbol]?.address),
              token[tokenOut.symbol].tokenId,
              token[tokenOut.symbol].standard,

              userAddress,
              tokenOut.symbol
            )
          );

        balancePromises.push(
          getBalanceFromTzkt(
            String(token["PLY"]?.address),
            token["PLY"].tokenId,
            token["PLY"].standard,
            userAddress,
            "PLY"
          )
        );
        const balanceResponse = await Promise.all(balancePromises);

        setUserBalances((prev) => ({
          ...prev,
          ...balanceResponse.reduce(
            (acc, cur) => ({
              ...acc,
              [cur.identifier]: cur.balance,
            }),
            {}
          ),
        }));
      }
    };
    updateBalance();
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
    dispatch(getTotalVotingPower());
  }, [userAddress]);
  useEffect(() => {
    if (totalVotingPowerError) {
      dispatch(getTotalVotingPower());
    }
  }, [totalVotingPowerError]);
  useEffect(() => {
    if (!initialPriceCall.current) {
      Object.keys(token).length !== 0 && dispatch(getTokenPrice());
    } else {
      initialPriceCall.current = false;
    }
  }, [token]);
  useEffect(() => {
    if (!initialLpPriceCall.current) {
      Object.keys(tokenPrice).length !== 0 && dispatch(getLpTokenPrice(tokenPrice));
    } else {
      initialLpPriceCall.current = false;
    }
  }, [tokenPrice]);
  useEffect(() => {
    Object.keys(amm).length !== 0 && dispatch(createGaugeConfig());
  }, [amm]);
  useEffect(() => {
    if (userAddress && Object.keys(tokenPrice).length !== 0) {
      dispatch(
        fetchAllLocksRewardsData({ userTezosAddress: userAddress, tokenPrices: tokenPrice })
      );
      dispatch(
        fetchAllRewardsOperationsData({ userTezosAddress: userAddress, tokenPrices: tokenPrice })
      );
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
        dispatch(
          fetchAllRewardsOperationsData({ userTezosAddress: userAddress, tokenPrices: tokenPrice })
        );
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
  useEffect(() => {
    if (!initialRewardsAprCall.current) {
      if (Object.keys(tokenPrice).length !== 0) {
        dispatch(
          getRewardsAprEstimate({
            totalVotingPower: currentTotalVotingPower,
            tokenPrices: tokenPrice,
          })
        );
      }
    } else {
      initialRewardsAprCall.current = false;
    }
  }, [currentTotalVotingPower, tokenPrice]);
  useEffect(() => {
    if (rewardsAprEstimateError && Object.keys(tokenPrice).length !== 0) {
      dispatch(
        getRewardsAprEstimate({
          totalVotingPower: currentTotalVotingPower,
          tokenPrices: tokenPrice,
        })
      );
    }
  }, [rewardsAprEstimateError]);
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
        (Number(userBalances[MigrateToken.PLENTY]) !== 0 ||
          Number(userBalances[MigrateToken.WRAP]) !== 0) &&
        vestedData.claimableAmount?.toNumber() === 0
      ) {
        setShowMigrateSwap(true);
        setIsClaimVested(false);
        setShowTopBar(false);
      } else if (
        (Number(userBalances[MigrateToken.PLENTY]) !== 0 ||
          Number(userBalances[MigrateToken.WRAP]) !== 0) &&
        vestedData.claimableAmount?.toNumber() !== 0
      ) {
        setShowTopBar(true);
        setShowMigrateSwap(true);
        setIsClaimVested(false);
      } else if (
        Number(userBalances[MigrateToken.PLENTY]) === 0 &&
        Number(userBalances[MigrateToken.WRAP]) === 0 &&
        vestedData.claimableAmount?.toNumber() !== 0
      ) {
        setIsClaimVested(true);
        setShowTopBar(false);
        setShowMigrateSwap(false);
      } else if (
        Number(userBalances[MigrateToken.PLENTY]) === 0 &&
        Number(userBalances[MigrateToken.WRAP]) === 0 &&
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
    userBalances[MigrateToken.PLENTY],
    userBalances[MigrateToken.WRAP],
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
                  plentyBal={new BigNumber(userBalances[MigrateToken.PLENTY])}
                  wrapBal={new BigNumber(userBalances[MigrateToken.WRAP])}
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
              plentyBal={new BigNumber(userBalances[MigrateToken.PLENTY])}
              wrapBal={new BigNumber(userBalances[MigrateToken.WRAP])}
            />
          )}

          {isClaimVested && <ClaimVested vestedData={vestedData} />}
          {showMigrateSwap && <Migrate allBalance={userBalances} />}
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

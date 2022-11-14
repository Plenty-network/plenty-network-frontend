import { PopUpModal } from "../Modal/popupModal";
import SearchBar from "../SearchBar/SearchBar";
import Image from "next/image";
import infogrey from "../../assets/icon/swap/info-grey.svg";
import { tokenParameter, tokensModal, tokenType } from "../../constants/swap";
import { BigNumber } from "bignumber.js";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import clsx from "clsx";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { topTokenListGhostnet } from "../../api/swap/wrappers";
import { getTokenDataFromTzkt } from "../../api/util/tokens";
import { Chain, ITokenInterface } from "../../config/types";
import { getAllTokensBalanceFromTzkt } from "../../api/util/balance";
import { useAppSelector } from "../../redux";
import { IAllTokensBalance } from "../../api/util/types";

interface ISwapModalProps {
  tokens: tokensModal[];
  show: boolean;
  selectToken: Function;
  onhide?: Function;
  tokenIn: tokenParameter;
  tokenOut: tokenParameter;
  searchQuery: string;
  tokenType: tokenType;
  setSearchQuery: Function;
  allBalance: {
    [id: string]: BigNumber;
  };
  isLoading: boolean;
}
function TokenModalPool(props: ISwapModalProps) {
  const userAddress = useAppSelector((state) => state.wallet.address);
  const searchTokenEl = useRef(null);
  const [tokensToShow, setTokensToShow] = useState<tokensModal[] | []>([]);
  const [topTokens, setTopTokens] = useState<{
    [id: string]: number;
  }>(
    {} as {
      [id: string]: number;
    }
  );
  const tokenFromContract = useRef<ITokenInterface[]>([] as ITokenInterface[]);
  useEffect(() => {
    topTokenListGhostnet().then((res) => {
      setTopTokens(res.topTokens);
    });
  }, []);

  const topTokensListArray = useMemo(() => {
    const tokensArray = Object.entries(topTokens);
    return tokensArray.map((token) => ({
      name: token[0],
      image: `/assets/Tokens/${token[0]}.png`,
    }));
  }, [topTokens]);

  const searchHits = useCallback(
    (token: tokensModal) => {
      return (
        props.searchQuery.length === 0 ||
        token.name.toLowerCase().includes(props.searchQuery.trim().toLowerCase()) ||
        token.address?.toLowerCase().includes(props.searchQuery.trim().toLowerCase()) ||
        (props.searchQuery.toLowerCase() === "xtz" &&
          token.name.toLowerCase().search(/\btez\b/) >= 0)
      );
    },
    [props.searchQuery]
  );
  const [contractTokenBalance, setContractTokenBalance] = useState<IAllTokensBalance>(
    {} as IAllTokensBalance
  );
  useEffect(() => {
    const filterTokens = () => {
      const filterTokenslist = props.tokens
        .filter(searchHits)

        .map((token) => {
          return { ...token };
        });

      if (filterTokenslist.length === 0) {
        getTokenDataFromTzkt(props.searchQuery.trim()).then((res) => {
          if (res.allTokensList.length !== 0) {
            getAllTokensBalanceFromTzkt(res.allTokensList, userAddress).then((res) => {
              setContractTokenBalance(res.allTokensBalances);
            });
            //tokenFromContract.current = res.allTokensList;
            const res1 = res.allTokensList.map((token) => ({
              name: token.symbol,
              image: token.iconUrl ? token.iconUrl : `/assets/Tokens/ctez.png`,
              new: false,
              chainType: Chain.TEZOS,
            }));

            setTokensToShow(res1);
          } else {
            tokenFromContract.current = [];
            setTokensToShow([]);
          }
        });
      } else {
        setTokensToShow(filterTokenslist);
      }
    };
    filterTokens();
  }, [
    props.tokens,
    props.searchQuery,

    props.tokenType,
    props.tokenIn.name,
    props.tokenOut.name,
    searchHits,
  ]);
  const tEZorCTEZtoUppercase = (a: string) =>
    a.trim().toLowerCase() === "tez" || a.trim().toLowerCase() === "ctez" ? a.toUpperCase() : a;
  return props.show ? (
    <PopUpModal title="Select Token" onhide={props.onhide}>
      {
        <>
          <div className="mt-5">
            <SearchBar
              inputRef={searchTokenEl}
              value={props.searchQuery}
              onChange={(ev: any) => props.setSearchQuery(ev.target.value)}
            />
          </div>
          <div className="text-text-400 mt-[20px] font-body1">
            Common base
            <span className="relative top-0.5 ml-[5px]">
              <ToolTip
                id="tooltipH"
                position={Position.top}
                toolTipChild={
                  <div className="w-[200px]">
                    These tokens are commonly paired with other tokens
                  </div>
                }
              >
                <Image alt={"alt"} src={infogrey} />
              </ToolTip>
            </span>
          </div>
          <div className="flex flex-wrap mt-1">
            {topTokensListArray.map((token, index) => {
              return (
                <div
                  className={clsx(
                    "border mr-2 mt-2 border-text-800 px-2.5 py-1 rounded-[31px] h-[34px] bg-card-100",
                    props.tokenIn.name === token.name || props.tokenOut.name === token.name
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  )}
                  key={index}
                  {...(props.tokenIn.name === token.name || props.tokenOut.name === token.name
                    ? {}
                    : { onClick: () => props.selectToken(token) })}
                >
                  <span className="w-[18px] h-[18px] relative top-1">
                    <Image alt={"alt"} src={token.image} width={"18px"} height={"18px"} />{" "}
                  </span>
                  <span className="font-body3">{tEZorCTEZtoUppercase(token.name)}</span>
                </div>
              );
            })}
          </div>
          {Object.keys(tokensToShow).length === 0 ? (
            <div className="border  h-[300px]  border-text-800 bg-muted-200 rounded-xl flex justify-center items-center px-[18px] w-full pb-5 mt-5 font-body4 text-white">
              No Tokens found
            </div>
          ) : (
            <div
              id="tokensList"
              className="border relative max-h-[300px] h-[300px] modal overflow-y-auto border-text-800 bg-muted-200 rounded-xl  w-full pb-5 mt-5"
            >
              {tokensToShow.map((token, index) => {
                return (
                  <div
                    className={clsx(
                      " flex content-center  px-[18px] hover:bg-card-100 py-2",
                      props.tokenIn.name === token.name || props.tokenOut.name === token.name
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    )}
                    key={index}
                    {...(props.tokenIn.name === token.name || props.tokenOut.name === token.name
                      ? {}
                      : { onClick: () => props.selectToken(token) })}
                  >
                    <div>
                      <span className="w-[30px] h-[30px] relative top-1">
                        <Image alt={"alt"} src={token.image} width={"30px"} height={"30px"} />{" "}
                      </span>
                    </div>
                    <div className="ml-2">
                      <div className="font-body1 text-text-100/[0.2]">{token.chainType}</div>
                      <div
                        className={clsx(
                          "font-subtitle4 ",
                          props.tokenIn.name === token.name || props.tokenOut.name === token.name
                            ? "text-white/[0.1]"
                            : "text-white"
                        )}
                      >
                        {token.name === "tez" ? "TEZ" : token.name === "ctez" ? "CTEZ" : token.name}
                      </div>
                    </div>
                    {token.new && (
                      <div className="ml-auto mt-[6px] bg-primary-500/[0.2] py-1 px-1.5 h-[26px] text-center text-primary-500 font-body2 rounded-xl">
                        <span>New!</span>
                      </div>
                    )}
                    {(contractTokenBalance[token.name] || props.allBalance[token.name]) &&
                    props.isLoading ? (
                      <div className="font-subtitle4 ml-auto mt-[7px]">
                        {props.allBalance[token.name]
                          ? props.allBalance[token.name].toFixed(2)
                          : contractTokenBalance[token.name]
                          ? contractTokenBalance[token.name].balance.toFixed(2)
                          : 0.0}
                      </div>
                    ) : (
                      <div className=" ml-auto h-[19px] rounded  animate-pulse bg-shimmer-100 text-shimmer-100 mt-[7px]">
                        9999
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      }
    </PopUpModal>
  ) : null;
}

export default TokenModalPool;

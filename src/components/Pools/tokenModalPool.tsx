import { PopUpModal } from "../Modal/popupModal";
import SearchBar from "../SearchBar/SearchBar";
import Image, { StaticImageData } from "next/image";
import infogrey from "../../assets/icon/swap/info-grey.svg";

import fromExponential from "from-exponential";
import fallback from "../../assets/icon/pools/fallback.png";

import fallbacksvg from "../../assets/icon/pools/fallbacksvg.svg";
import { tokenParameter, tokensModal, tokenType } from "../../constants/swap";
import { BigNumber } from "bignumber.js";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import clsx from "clsx";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { topTokenListGhostnet } from "../../api/swap/wrappers";
import { getTokenDataFromTzkt } from "../../api/util/tokens";
import { Chain, IConfigToken } from "../../config/types";
import { getAllTokensBalanceFromTzkt } from "../../api/util/balance";
import { useAppSelector } from "../../redux";
import { IAllTokensBalance } from "../../api/util/types";
import { changeSource, imageExists, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { tokenIcons } from "../../constants/tokensList";

interface ISwapModalProps {
  tokens: {
    name: string;
    image: string | StaticImageData;
    chainType: Chain;
    address: string | undefined;
    interface: IConfigToken;
  }[];
  show: boolean;
  selectToken: Function;
  onhide?: Function;
  tokenIn: tokenParameter;
  tokenOut: tokenParameter;
  searchQuery: string;
  tokenType: tokenType;
  setSearchQuery: Function;
  allBalance: IAllTokensBalance;
  isLoading: boolean;
}
function TokenModalPool(props: ISwapModalProps) {
  const userAddress = useAppSelector((state) => state.wallet.address);
  const searchTokenEl = useRef(null);
  const tokenFromConfig = useAppSelector((state) => state.config.tokens);

  const [tokensToShow, setTokensToShow] = useState<
    | {
        name: string;
        image: string | StaticImageData;
        chainType: Chain;
        address: string | undefined;
        interface: IConfigToken;
      }[]
    | []
  >([]);
  const [topTokens, setTopTokens] = useState<{
    [id: string]: number;
  }>(
    {} as {
      [id: string]: number;
    }
  );

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
      interface: tokenFromConfig[token[0]],
    }));
  }, [topTokens]);

  const searchHits = useCallback(
    (token: {
      name: string;
      image: string | StaticImageData;
      chainType: Chain;
      address: string | undefined;
      interface: IConfigToken;
    }) => {
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

  function getUnion(
    array1: {
      name: string;
      image: string | StaticImageData;
      address: string;
      chainType: Chain;
      interface: IConfigToken;
    }[],
    array2: {
      name: string;
      image: string | StaticImageData;
      chainType: Chain;
      address: string | undefined;
      interface: IConfigToken;
    }[]
  ) {
    const res: {
      name: string;
      image: string | StaticImageData;
      address: string | undefined;
      chainType: Chain;
      interface: IConfigToken;
    }[] = [];
    if (array1.length >= array2.length) {
      array1.filter((token) => {
        var flag = 0;

        array2.filter((k) => {
          if (k.name.includes(token.name)) {
            flag = 1;
          } else {
          }
        });
        if (flag == 0) {
          res.push(token);
        }
      });
    } else {
      array2.filter((token) => {
        var flag = 0;
        array1.filter((k) => {
          if (k.name.includes(token.name)) {
            flag = 1;
          } else {
          }
        });
        if (flag == 0) {
          res.push(token);
        }
      });
    }
    return res;
  }
  useMemo(() => {
    const filterTokens = () => {
      const filterTokenslist = props.tokens
        .filter(searchHits)

        .map((token) => {
          return { ...token };
        });

      if (filterTokenslist.length === 0) {
        if (props.searchQuery !== "" && props.searchQuery.length > 8) {
          getTokenDataFromTzkt(props.searchQuery.trim()).then((res) => {
            if (res.allTokensList.length !== 0) {
              getAllTokensBalanceFromTzkt(res.allTokensList, userAddress).then((res) => {
                setContractTokenBalance(res.allTokensBalances);
              });
              const res1 = res.allTokensList.map((token) => ({
                name: token.symbol,
                image: token.iconUrl ? token.iconUrl.toString() : fallbacksvg,
                address: "",
                chainType: Chain.TEZOS,
                interface: token,
              }));

              setTokensToShow(res1);
            } else {
              setTokensToShow([]);
            }
          });
        }
      } else if (props.searchQuery !== "" && props.searchQuery.length > 8) {
        getTokenDataFromTzkt(props.searchQuery.trim()).then((res) => {
          if (res.allTokensList.length !== 0) {
            getAllTokensBalanceFromTzkt(res.allTokensList, userAddress).then((res) => {
              setContractTokenBalance(res.allTokensBalances);
            });
            const res1 = res.allTokensList.map((token) => ({
              name: token.symbol,
              image: token.iconUrl ? token.iconUrl.toString() : fallbacksvg,
              address: "",
              chainType: Chain.TEZOS,
              interface: token,
            }));

            const result = Array.from(
              new Set([...filterTokenslist, ...getUnion(res1, filterTokenslist)])
            );
            setTokensToShow(result);
          } else {
            setTokensToShow(filterTokenslist);
          }
        });
        //setTokensToShow(filterTokenslist);
      } else {
        setTokensToShow(filterTokenslist);
      }
    };
    filterTokens();
  }, [
    props.tokens,
    props.searchQuery,
    // props.tokenType,
    // props.tokenIn.name,
    // props.tokenOut.name,
    searchHits,
  ]);

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
              if (token.name !== "XTZ") {
                return (
                  <div
                    className={clsx(
                      "border mr-2 mt-2 flex items-center border-text-800 px-2.5 py-1 rounded-[31px] h-[34px] bg-card-100",
                      props.tokenIn.name === token.name || props.tokenOut.name === token.name
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    )}
                    key={index}
                    {...(props.tokenIn.name === token.name || props.tokenOut.name === token.name
                      ? {}
                      : { onClick: () => props.selectToken(token) })}
                  >
                    <span className="w-[18px] h-[18px] relative top-0">
                      <img
                        alt={"alt"}
                        src={
                          tokenIcons[token.name]
                            ? tokenIcons[token.name].src
                            : tokenFromConfig[token.name.toString()]?.iconUrl
                            ? tokenFromConfig[token.name.toString()].iconUrl
                            : `/assets/Tokens/fallback.png`
                        }
                        width={"18px"}
                        height={"18px"}
                        onError={changeSource}
                      />{" "}
                    </span>
                    <span className="font-body3 ml-1">{tEZorCTEZtoUppercase(token.name)}</span>
                  </div>
                );
              }
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
                        <img
                          alt={"alt"}
                          src={
                            tokenIcons[token.name.toString()]
                              ? tokenIcons[token.name.toString()].src
                              : tokenFromConfig[token.name?.toString()]?.iconUrl
                              ? tokenFromConfig[token.name.toString()].iconUrl
                              : token.image
                              ? (token.image as string)
                              : `/assets/Tokens/fallback.png`
                          }
                          width={"30px"}
                          height={"30px"}
                          onError={changeSource}
                        />{" "}
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
                        {tEZorCTEZtoUppercase(token.name)}
                      </div>
                    </div>
                    {/* {token.new && (
                      <div className="ml-auto mt-[6px] bg-primary-500/[0.2] py-1 px-1.5 h-[26px] text-center text-primary-500 font-body2 rounded-xl">
                        <span>New!</span>
                      </div>
                    )} */}
                    {(contractTokenBalance[token.name] || props.allBalance[token.name]) &&
                    props.isLoading ? (
                      <div className="font-subtitle4 ml-auto mt-[7px]">
                        <ToolTip
                          position={Position.top}
                          message={
                            props.allBalance[token.name]?.balance
                              ? fromExponential(props.allBalance[token.name]?.balance.toString())
                              : contractTokenBalance[token.name]
                              ? fromExponential(
                                  contractTokenBalance[token.name]?.balance.toString()
                                )
                              : "0"
                          }
                          disable={Number(props.allBalance[token.name]?.balance) === 0}
                        >
                          {props.allBalance[token.name]?.balance
                            ? props.allBalance[token.name]?.balance.toFixed(2)
                            : contractTokenBalance[token.name]
                            ? contractTokenBalance[token.name]?.balance.toFixed(2)
                            : 0.0}
                        </ToolTip>
                      </div>
                    ) : props.isLoading === false ? (
                      <div className="font-subtitle4 ml-auto mt-[7px]">0</div>
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

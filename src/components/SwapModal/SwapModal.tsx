import { PopUpModal } from "../Modal/popupModal";
import SearchBar from "../SearchBar/SearchBar";
import Image from "next/image";
import fromExponential from "from-exponential";
import infogrey from "../../assets/icon/swap/info-grey.svg";
import { tokenParameter, tokensModal, tokenType } from "../../constants/swap";
import { BigNumber } from "bignumber.js";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import clsx from "clsx";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { topTokensList } from "../../api/swap/wrappers";
import { Chain } from "../../config/types";
import { IAllTokensBalance } from "../../api/util/types";
import nFormatter, { changeSource, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { tokenIcons } from "../../constants/tokensList";
import { useAppSelector } from "../../redux";

// Define the props interface for the component
interface ISwapModalProps {
  tokens: {
    name: string;
    image: string;
    chainType: Chain;
    address: string | undefined;
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
  isSuccess: boolean;
}

// Define the SwapModal component
function SwapModal(props: ISwapModalProps) {
  // Access Redux state using the useAppSelector hook
  const tokens = useAppSelector((state) => state.config.tokens);

  // Create a ref for the search input element
  const searchTokenEl = useRef(null);

  // State to store the list of tokens to display
  const [tokensToShow, setTokensToShow] = useState<
    | {
        name: string;
        image: string;
        chainType: Chain;
        address: string | undefined;
      }[]
    | []
  >([]);

  // State to store the list of top tokens
  const [topTokens, setTopTokens] = useState<{
    [id: string]: number;
  }>(
    {} as {
      [id: string]: number;
    }
  );

  // Fetch the top tokens when the component mounts
  useEffect(() => {
    topTokensList().then((res) => {
      setTopTokens(res.topTokens);
    });
  }, []);

  // Create an array from the topTokens object
  const topTokensListArray = useMemo(() => {
    const tokensArray = Object.entries(topTokens);
    return tokensArray.map((token) => ({
      name: token[0],
      image: `/assets/Tokens/${token[0]}.png`,
    }));
  }, [topTokens]);

  // Callback function to filter tokens based on search query
  const searchHits = useCallback(
    (token: { name: string; image: string; chainType: Chain; address: string | undefined }) => {
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

  // Effect to filter and update the displayed tokens
  useEffect(() => {
    const filterTokens = () => {
      const filterTokenslist = props.tokens.filter(searchHits).map((token) => {
        return { ...token };
      });

      setTokensToShow(filterTokenslist);
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
                <Image alt={"alt"} src={infogrey} className="cursor-pointer" />
              </ToolTip>
            </span>
          </div>
          <div className="flex flex-wrap mt-1">
            {topTokensListArray.map((token, index) => {
              return (
                <div
                  className={clsx(
                    "border mr-2 mt-2 border-text-800 flex items-center  px-2.5 py-1 rounded-[31px] h-[34px] bg-card-100",
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
                          : tokens[token.name.toString()]?.iconUrl
                          ? tokens[token.name.toString()].iconUrl
                          : `/assets/Tokens/fallback.png`
                      }
                      width={"18px"}
                      height={"18px"}
                      onError={changeSource}
                    />
                  </span>
                  <span className="font-body3 ml-1">{tEZorCTEZtoUppercase(token.name)}</span>
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
                        <img
                          alt={"alt"}
                          src={
                            tokenIcons[token.name]
                              ? tokenIcons[token.name].src
                              : tokens[token.name.toString()]?.iconUrl
                              ? tokens[token.name.toString()].iconUrl
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
                    {props.isSuccess && props.allBalance[token.name] ? (
                      <div className="font-subtitle4 cursor-pointer ml-auto mt-[7px]">
                        <ToolTip
                          position={Position.top}
                          message={
                            props.allBalance[token.name]?.balance
                              ? fromExponential(props.allBalance[token.name]?.balance.toString())
                              : "0"
                          }
                          disable={Number(props.allBalance[token.name]?.balance) === 0}
                        >
                          {props.allBalance[token.name]?.balance
                            ? Number(props.allBalance[token.name]?.balance) > 0
                              ? props.allBalance[token.name]?.balance.isLessThan(0.01)
                                ? "<0.01"
                                : nFormatter(props.allBalance[token.name]?.balance)
                              : "0.0"
                            : "0.0"}
                        </ToolTip>
                      </div>
                    ) : props.isSuccess === false ? (
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

export default SwapModal;

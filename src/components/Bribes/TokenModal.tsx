import { PopUpModal } from "../Modal/popupModal";
import SearchBar from "../SearchBar/SearchBar";
import Image from "next/image";
import { tokenParameter, tokensModal } from "../../constants/swap";
import fromExponential from "from-exponential";
import { BigNumber } from "bignumber.js";
import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Chain } from "../../config/types";
import { IAllTokensBalance } from "../../api/util/types";
import nFormatter, { changeSource, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { Position, ToolTip } from "../Tooltip/TooltipAdvanced";
import { useAppSelector } from "../../redux";
import { tokenIcons } from "../../constants/tokensList";

interface ISwapModalProps {
  tokens: {
    name: string;
    image: string;
    chainType: Chain;
    address: string | undefined;
  }[];
  isLoading?: boolean;
  show: boolean;
  selectToken: Function;
  onhide: Function;
  tokenIn: tokenParameter;

  allBalance: IAllTokensBalance;
  isSucess: boolean;
}
function TokenModal(props: ISwapModalProps) {
  const tokens = useAppSelector((state) => state.config.tokens);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTokenEl = useRef(null);
  const [tokensToShow, setTokensToShow] = useState<
    | {
        name: string;
        image: string;
        chainType: Chain;
        address: string | undefined;
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

  const searchHits = useCallback(
    (token: { name: string; image: string; chainType: Chain; address: string | undefined }) => {
      return (
        searchQuery.length === 0 ||
        token.name.trim().toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        token.address?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        (searchQuery.toLowerCase() === "xtz" && token.name.toLowerCase().search(/\btez\b/) >= 0)
      );
    },
    [searchQuery]
  );
  useEffect(() => {
    props.tokens.sort(
      (a, b) =>
        Number(props.allBalance[b.name]?.balance) - Number(props.allBalance[a.name]?.balance)
    );
    const filterTokens = () => {
      const filterTokenslist = props.tokens
        .filter(searchHits)

        .map((token) => {
          return { ...token };
        });

      setTokensToShow(filterTokenslist);
    };
    filterTokens();
  }, [props.tokens, searchQuery, props.tokenIn.name, searchHits]);

  return props.show ? (
    <PopUpModal title="Select Token" onhide={() => props.onhide(false)}>
      {
        <>
          <div className="mt-5">
            <SearchBar
              inputRef={searchTokenEl}
              value={searchQuery}
              onChange={(ev: any) => setSearchQuery(ev.target.value)}
            />
          </div>
          {Object.keys(tokensToShow).length === 0 ? (
            <div className="border  h-[419px]  border-text-800 bg-muted-200 rounded-xl flex justify-center items-center px-[18px] w-full pb-5 mt-5 font-body4 text-white">
              No Tokens found
            </div>
          ) : (
            <div
              id="tokensList"
              className="border relative max-h-[419px] h-[419px] modal overflow-y-auto border-text-800 bg-muted-200 rounded-xl  w-full pb-5 mt-5"
            >
              {tokensToShow.map((token, index) => {
                return (
                  <div
                    className={clsx(
                      " flex content-center  px-[18px] hover:bg-card-100 py-2",
                      props.tokenIn.name === token.name ? "cursor-not-allowed" : "cursor-pointer"
                    )}
                    key={index}
                    {...(props.tokenIn.name === token.name
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
                          props.tokenIn.name === token.name ? "text-white/[0.1]" : "text-white"
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
                    {props.isSucess && props.allBalance[token.name]?.balance ? (
                      <div className="font-subtitle4 ml-auto mt-[7px]">
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
                    ) : props.isSucess === false ? (
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

export default TokenModal;

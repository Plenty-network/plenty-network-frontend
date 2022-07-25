import { PopUpModal } from '../Modal/popupModal';
import SearchBar from '../SearchBar/SearchBar';
import Image from 'next/image';
import infogrey from '../../assets/icon/swap/info-grey.svg';
import plenty from '../../assets/Tokens/plenty.png';
import { tokenParameter, tokensModal, tokenType } from '../../constants/swap';
import { BigNumber } from 'bignumber.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

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
}
function SwapModal(props: ISwapModalProps) {
  const searchTokenEl = useRef(null);
  const [tokensToShow, setTokensToShow] = useState<tokensModal[] | []>([]);

  const searchHits = useCallback(
    (token: tokensModal) => {
      return (
        props.searchQuery.length === 0 ||
        token.name.toLowerCase().includes(props.searchQuery.toLowerCase())
      );
    },
    [props.searchQuery]
  );
  useEffect(() => {
    const filterTokens = () => {
      const filterTokenslist = props.tokens
        .filter(searchHits)

        .map((token) => {
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
              <Image src={infogrey} />
            </span>
          </div>
          <div className="flex flex-wrap mt-1">
            <div className="border mr-2 mt-2 border-text-800 px-2.5 py-1 rounded-[31px] h-[34px] bg-card-100">
              <span className="w-[18px] h-[18px] relative top-1">
                <Image src={plenty} width={'18px'} height={'18px'} />{' '}
              </span>
              <span className="font-body3">PLENTY</span>
            </div>
            <div className="border mr-2 mt-2 border-text-800 px-2.5 py-1 rounded-[31px] h-[34px] bg-card-100">
              <span className="w-[18px] h-[18px] relative top-1">
                <Image src={plenty} width={'18px'} height={'18px'} />{' '}
              </span>
              <span className="font-body3">PLENTY</span>
            </div>
            <div className="border mr-2 mt-2 border-text-800 px-2.5 py-1 rounded-[31px] h-[34px] bg-card-100">
              <span className="w-[18px] h-[18px] relative top-1">
                <Image src={plenty} width={'18px'} height={'18px'} />{' '}
              </span>
              <span className="font-body3">PLENTY</span>
            </div>
            <div className="border mr-2 mt-2 border-text-800 px-2.5 py-1 rounded-[31px] h-[34px] bg-card-100">
              <span className="w-[18px] h-[18px] relative top-1">
                <Image src={plenty} width={'18px'} height={'18px'} />{' '}
              </span>
              <span className="font-body3">PLENTY</span>
            </div>
            <div className="border mr-2 mt-2 border-text-800 px-2.5 py-1 rounded-[31px] h-[34px] bg-card-100">
              <span className="w-[18px] h-[18px] relative top-1">
                <Image src={plenty} width={'18px'} height={'18px'} />{' '}
              </span>
              <span className="font-body3">PLENTY</span>
            </div>
            <div className="border mr-2 mt-2 border-text-800 px-2.5 py-1 rounded-[31px] h-[34px] bg-card-100">
              <span className="w-[18px] h-[18px] relative top-1">
                <Image src={plenty} width={'18px'} height={'18px'} />{' '}
              </span>
              <span className="font-body3">PLENTY</span>
            </div>
            <div className="border mr-2 mt-2 border-text-800 px-2.5 py-1 rounded-[31px] h-[34px] bg-card-100">
              <span className="w-[18px] h-[18px] relative top-1">
                <Image src={plenty} width={'18px'} height={'18px'} />{' '}
              </span>
              <span className="font-body3">PLENTY</span>
            </div>
            <div className="border mr-2 mt-2 border-text-800 px-2.5 py-1 rounded-[31px] h-[34px] bg-card-100">
              <span className="w-[18px] h-[18px] relative top-1">
                <Image src={plenty} width={'18px'} height={'18px'} />{' '}
              </span>
              <span className="font-body3">PLENTY</span>
            </div>
          </div>
          {Object.keys(tokensToShow).length === 0 ? (
            <div className="border  h-[300px]  border-text-800 bg-muted-200 rounded-xl flex justify-center items-center px-[18px] w-full pb-5 mt-5 text-white">
              No results found
            </div>
          ) : (
            <div
              id="tokensList"
              className="border relative max-h-[300px] overflow-y-auto border-text-800 bg-card-100 rounded-xl px-[18px] w-full pb-5 mt-5"
            >
              {tokensToShow.map((token, index) => {
                return (
                  <div
                    className={clsx(
                      ' flex content-center mt-4',
                      props.tokenIn.name === token.name ||
                        props.tokenOut.name === token.name
                        ? 'cursor-not-allowed'
                        : 'cursor-pointer'
                    )}
                    key={index}
                    {...(props.tokenIn.name === token.name ||
                    props.tokenOut.name === token.name
                      ? {}
                      : { onClick: () => props.selectToken(token) })}
                  >
                    <div>
                      <span className="w-[30px] h-[30px] relative top-1">
                        <Image
                          src={token.image}
                          width={'30px'}
                          height={'30px'}
                        />{' '}
                      </span>
                    </div>
                    <div className="ml-2">
                      <div className="font-body1 text-text-100/[0.2]">
                        Aave Token
                      </div>
                      <div
                        className={clsx(
                          'font-subtitle4 ',
                          props.tokenIn.name === token.name ||
                            props.tokenOut.name === token.name
                            ? 'text-white/[0.1]'
                            : 'text-white'
                        )}
                      >
                        {token.name === 'tez'
                          ? 'TEZ'
                          : token.name === 'ctez'
                          ? 'CTEZ'
                          : token.name}
                      </div>
                    </div>
                    {token.new && (
                      <div className="ml-auto mt-[6px] bg-primary-500/[0.2] py-1 px-1.5 h-[26px] text-center text-primary-500 font-body2 rounded-xl">
                        <span>New!</span>
                      </div>
                    )}
                    <div className="font-subtitle4 ml-auto mt-[7px]">
                      {props.allBalance[token.name]
                        ? Number(props.allBalance[token.name]).toFixed(2)
                        : 0.0}
                    </div>
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

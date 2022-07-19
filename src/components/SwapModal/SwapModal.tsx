import { PopUpModal } from '../Modal/popupModal';
import SearchBar from '../SearchBar/SearchBar';
import Image from 'next/image';
import infogrey from '../../assets/icon/swap/info-grey.svg';
import plenty from '../../assets/Tokens/plenty.png';
import { tokenParameter, tokensModal, tokenType } from '../../constants/swap';
import { useCallback, useEffect, useRef, useState } from 'react';

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
        .filter((token) => {
          if (props.tokenType === 'tokenOut') {
            return props.tokenIn.name !== token.name;
          }

          return props.tokenOut.name !== token.name;
        })
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
          <div className="border relative max-h-[300px] overflow-y-auto border-text-800 bg-card-100 rounded-[31px] px-[18px] w-full pb-4 mt-5">
            {tokensToShow.map((token, index) => {
              return (
                <div
                  className="cursor-pointer flex content-center mt-4"
                  key={index}
                  onClick={() => props.selectToken(token)}
                >
                  <div>
                    <span className="w-[30px] h-[30px] relative top-1">
                      <Image src={token.image} width={'30px'} height={'30px'} />{' '}
                    </span>
                  </div>
                  <div className="ml-2">
                    <div className="font-body3 text-text-100/[0.2]">
                      Aave Token
                    </div>
                    <div className="font-subtitle4 text-white">
                      {token.name}
                    </div>
                  </div>
                  {token.new && (
                    <div className="ml-auto mt-[6px] bg-primary-500/[0.2] py-1 px-1.5 h-[26px] text-center text-primary-500 font-body2 rounded-xl">
                      <span>New!</span>
                    </div>
                  )}
                  <div className="font-subtitle4 ml-auto mt-[7px]">0.0</div>
                </div>
              );
            })}
          </div>
        </>
      }
    </PopUpModal>
  ) : null;
}

export default SwapModal;

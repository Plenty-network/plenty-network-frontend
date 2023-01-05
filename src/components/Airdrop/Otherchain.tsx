import { useAppSelector } from "../../redux";
import Image from "next/image";
import clsx from "clsx";
import infoBlue from "../../../src/assets/icon/pools/InfoBlue.svg";
import infoRed from "../../../src/assets/icon/airdrop/Info_red.svg";
import { ChainAirdrop } from "./Disclaimer";
import ply from "../../assets/Tokens/ply.png";
import TokenDropdown from "../TokenDropdown/TokenDropdown";
import EvmWalletButton from "./EvmWalletButton";
import { EvmCTAState, TextType } from "../../redux/airdrop/types";
export interface IOtherChain {
  setChain: React.Dispatch<React.SetStateAction<ChainAirdrop>>;
}

function OtherChain(props: IOtherChain) {
  const tokenOut = {
    name: "PLY",
    image: ply,
  };
  const textToDisplay = useAppSelector((state) => state.airdropState.textDisplayState);
  const ethClaimAmount = useAppSelector((state) => state.airdropState.ethClaimAmount);
  const evmCTAState = useAppSelector((state) => state.airdropState.evmCTAState);

  return (
    <>
      <div
        className={clsx(
          "lg:w-[600px] secondtoken h-[82px] border border-text-800 rounded-2xl  px-4 border-primary-500/[0.2]  bg-card-500 mt-4"
        )}
      >
        <div className=" flex ">
          <div className={clsx(" mt-4", "flex-none")}>
            <TokenDropdown
              tokenIcon={tokenOut.image}
              tokenName={tokenOut.name}
              isArrow={true}
              tokenSymbol={tokenOut.name}
            />
          </div>
          <div className=" my-3 flex-auto">
            <div className="text-right font-body1 text-text-400">YOUR CLAIMABLE BALANCE</div>
            <div>
              {evmCTAState === EvmCTAState.LOADING ? (
                <p className=" my-[4px] ml-auto w-[100px] h-[32px] rounded animate-pulse bg-shimmer-100"></p>
              ) : (
                <input
                  type="text"
                  disabled
                  className={clsx(
                    "text-primary-500  inputSecond text-right border-0 font-input-text lg:font-medium1 outline-none w-[100%] placeholder:text-primary-500 "
                  )}
                  placeholder="0.0"
                  value={
                    ethClaimAmount.isGreaterThan(0)
                      ? ethClaimAmount.decimalPlaces(6, 1).toString()
                      : ethClaimAmount.decimalPlaces(0, 1).toString()
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {textToDisplay.isVisible && textToDisplay.textType !== TextType.NONE && (
        <div
          className={clsx(
            textToDisplay.textType === TextType.INFO ? "bg-info-500/[0.1]" : "bg-error-500/[0.1]",
            "h-[50px] md:h-[46px]  px-2 rounded-xl my-3 flex items-center "
          )}
        >
          <p className="relative top-0.5">
            <Image
              src={textToDisplay.textType === TextType.INFO ? infoBlue : infoRed}
              width={"22px"}
              height={"22px"}
            />
          </p>
          <p
            className={clsx(
              textToDisplay.textType === TextType.INFO ? "text-info-500" : "text-error-500",
              "font-body2  px-3 md:w-auto w-[330px]"
            )}
          >
            {textToDisplay.textData}
          </p>
        </div>
      )}

      <div className="mt-[18px]">
        <EvmWalletButton setChain={props.setChain} />
      </div>
    </>
  );
}

export default OtherChain;

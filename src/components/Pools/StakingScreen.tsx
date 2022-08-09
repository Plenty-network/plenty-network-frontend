import { ISimpleButtonProps, SimpleButton } from "./Component/SimpleButton";
import React, { useState } from "react";
import { SwitchWithIcon } from "../SwitchCheckbox/switchWithIcon";
import { InputText } from "./Component/InputText";
import {
  BtnWithStakeIcon,
  BtnWithWalletIcon,
} from "./Component/BtnWithWalletIcon";
import Button from "../Button/Button";
import { CircularImageInfo } from "./Component/CircularImageInfo";
import token from "../../assets/Tokens/plenty.png";
import token2 from "../../assets/Tokens/ctez.png";

export enum StakingScreenType {
  Staking = "Staking",
  Unstaking = "Unstaking",
}
export interface IStakingScreenProps {}
export interface IStakingProps {
  setStakingScreen: Function;
}
export interface IUnstakingProps {
  setStakingScreen: Function;
}
export function StakingScreen(props: IStakingScreenProps) {
  const [stakingScreen, setStakingScreen] = useState(StakingScreenType.Staking);
  return (
    <>
      {stakingScreen === StakingScreenType.Staking && (
        <Staking setStakingScreen={setStakingScreen} />
      )}
      {stakingScreen === StakingScreenType.Unstaking && (
        <Unstaking setStakingScreen={setStakingScreen} />
      )}
    </>
  );
}

export function Staking(props: IStakingProps) {
  return (
    <div className="flex flex-col">
      <div className="border rounded-2xl border-text-800 bg-card-200 px-3.5 pt-4 pb-6  mb-5">
        <div className="flex items-center justify-between flex-row  relative ">
          <div className="flex gap-2 items-center">
            <span className="relative ml-2 top-[3px]">
              <SwitchWithIcon
                isChecked={false}
                onChange={() =>
                  props.setStakingScreen(StakingScreenType.Unstaking)
                }
              />
            </span>
            <p className="text-f16 text-white">Stake Liquidity</p>
          </div>
        </div>
        {/* dropDown And InfoTab */}
        <div className="flex py-2 px-4 justify-between">
          <div>
            <svg
              width={150}
              height={36}
              viewBox="0 0 150 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width={149}
                height={35}
                rx="7.5"
                fill="#282230"
                fillOpacity="0.25"
                stroke="#403A47"
              />
              <path
                d="M17.256 23.098C16.6027 23.098 16.0147 22.986 15.492 22.762C14.9693 22.5287 14.5587 22.202 14.26 21.782C13.9613 21.362 13.812 20.872 13.812 20.312H15.52C15.5573 20.732 15.7207 21.0773 16.01 21.348C16.3087 21.6187 16.724 21.754 17.256 21.754C17.8067 21.754 18.236 21.6233 18.544 21.362C18.852 21.0913 19.006 20.746 19.006 20.326C19.006 19.9993 18.908 19.7333 18.712 19.528C18.5253 19.3227 18.2873 19.164 17.998 19.052C17.718 18.94 17.326 18.8187 16.822 18.688C16.1873 18.52 15.6693 18.352 15.268 18.184C14.876 18.0067 14.54 17.736 14.26 17.372C13.98 17.008 13.84 16.5227 13.84 15.916C13.84 15.356 13.98 14.866 14.26 14.446C14.54 14.026 14.932 13.704 15.436 13.48C15.94 13.256 16.5233 13.144 17.186 13.144C18.1287 13.144 18.8987 13.382 19.496 13.858C20.1027 14.3247 20.4387 14.9687 20.504 15.79H18.74C18.712 15.4353 18.544 15.132 18.236 14.88C17.928 14.628 17.522 14.502 17.018 14.502C16.5607 14.502 16.1873 14.6187 15.898 14.852C15.6087 15.0853 15.464 15.4213 15.464 15.86C15.464 16.1587 15.5527 16.406 15.73 16.602C15.9167 16.7887 16.15 16.938 16.43 17.05C16.71 17.162 17.0927 17.2833 17.578 17.414C18.222 17.5913 18.7447 17.7687 19.146 17.946C19.5567 18.1233 19.902 18.3987 20.182 18.772C20.4713 19.136 20.616 19.626 20.616 20.242C20.616 20.7367 20.4807 21.2033 20.21 21.642C19.9487 22.0807 19.5613 22.4353 19.048 22.706C18.544 22.9673 17.9467 23.098 17.256 23.098ZM29.5692 18.954C29.5692 19.2433 29.5506 19.5047 29.5132 19.738H23.6192C23.6659 20.354 23.8946 20.8487 24.3052 21.222C24.7159 21.5953 25.2199 21.782 25.8172 21.782C26.6759 21.782 27.2826 21.4227 27.6372 20.704H29.3592C29.1259 21.4133 28.7012 21.9967 28.0852 22.454C27.4786 22.902 26.7226 23.126 25.8172 23.126C25.0799 23.126 24.4172 22.9627 23.8292 22.636C23.2506 22.3 22.7932 21.8333 22.4572 21.236C22.1306 20.6293 21.9672 19.9293 21.9672 19.136C21.9672 18.3427 22.1259 17.6473 22.4432 17.05C22.7699 16.4433 23.2226 15.9767 23.8012 15.65C24.3892 15.3233 25.0612 15.16 25.8172 15.16C26.5452 15.16 27.1939 15.3187 27.7632 15.636C28.3326 15.9533 28.7759 16.4013 29.0932 16.98C29.4106 17.5493 29.5692 18.2073 29.5692 18.954ZM27.9032 18.45C27.8939 17.862 27.6839 17.3907 27.2732 17.036C26.8626 16.6813 26.3539 16.504 25.7472 16.504C25.1966 16.504 24.7252 16.6813 24.3332 17.036C23.9412 17.3813 23.7079 17.8527 23.6332 18.45H27.9032ZM32.7358 12.64V23H31.1398V12.64H32.7358ZM41.9013 18.954C41.9013 19.2433 41.8826 19.5047 41.8453 19.738H35.9513C35.9979 20.354 36.2266 20.8487 36.6373 21.222C37.0479 21.5953 37.5519 21.782 38.1493 21.782C39.0079 21.782 39.6146 21.4227 39.9693 20.704H41.6912C41.4579 21.4133 41.0333 21.9967 40.4173 22.454C39.8106 22.902 39.0546 23.126 38.1493 23.126C37.4119 23.126 36.7493 22.9627 36.1613 22.636C35.5826 22.3 35.1253 21.8333 34.7893 21.236C34.4626 20.6293 34.2993 19.9293 34.2993 19.136C34.2993 18.3427 34.4579 17.6473 34.7753 17.05C35.1019 16.4433 35.5546 15.9767 36.1333 15.65C36.7213 15.3233 37.3933 15.16 38.1493 15.16C38.8773 15.16 39.5259 15.3187 40.0953 15.636C40.6646 15.9533 41.1079 16.4013 41.4253 16.98C41.7426 17.5493 41.9013 18.2073 41.9013 18.954ZM40.2353 18.45C40.2259 17.862 40.0159 17.3907 39.6053 17.036C39.1946 16.6813 38.6859 16.504 38.0793 16.504C37.5286 16.504 37.0573 16.6813 36.6653 17.036C36.2733 17.3813 36.0399 17.8527 35.9653 18.45H40.2353ZM42.9399 19.136C42.9399 18.3427 43.0985 17.6473 43.4159 17.05C43.7425 16.4433 44.1905 15.9767 44.7599 15.65C45.3292 15.3233 45.9825 15.16 46.7199 15.16C47.6532 15.16 48.4232 15.384 49.0299 15.832C49.6459 16.2707 50.0612 16.9007 50.2759 17.722H48.5539C48.4139 17.3393 48.1899 17.0407 47.8819 16.826C47.5739 16.6113 47.1865 16.504 46.7199 16.504C46.0665 16.504 45.5439 16.7373 45.1519 17.204C44.7692 17.6613 44.5779 18.3053 44.5779 19.136C44.5779 19.9667 44.7692 20.6153 45.1519 21.082C45.5439 21.5487 46.0665 21.782 46.7199 21.782C47.6439 21.782 48.2552 21.376 48.5539 20.564H50.2759C50.0519 21.348 49.6319 21.9733 49.0159 22.44C48.3999 22.8973 47.6345 23.126 46.7199 23.126C45.9825 23.126 45.3292 22.9627 44.7599 22.636C44.1905 22.3 43.7425 21.8333 43.4159 21.236C43.0985 20.6293 42.9399 19.9293 42.9399 19.136ZM53.7284 16.588V20.858C53.7284 21.1473 53.7937 21.3573 53.9244 21.488C54.0644 21.6093 54.2977 21.67 54.6244 21.67H55.6044V23H54.3444C53.6257 23 53.0751 22.832 52.6924 22.496C52.3097 22.16 52.1184 21.614 52.1184 20.858V16.588H51.2084V15.286H52.1184V13.368H53.7284V15.286H55.6044V16.588H53.7284ZM63.6941 21.572L65.8781 15.286H67.5721L64.6321 23H62.7281L59.8021 15.286H61.5101L63.6941 21.572ZM75.8485 18.954C75.8485 19.2433 75.8298 19.5047 75.7925 19.738H69.8985C69.9452 20.354 70.1738 20.8487 70.5845 21.222C70.9952 21.5953 71.4992 21.782 72.0965 21.782C72.9552 21.782 73.5618 21.4227 73.9165 20.704H75.6385C75.4052 21.4133 74.9805 21.9967 74.3645 22.454C73.7578 22.902 73.0018 23.126 72.0965 23.126C71.3592 23.126 70.6965 22.9627 70.1085 22.636C69.5298 22.3 69.0725 21.8333 68.7365 21.236C68.4098 20.6293 68.2465 19.9293 68.2465 19.136C68.2465 18.3427 68.4052 17.6473 68.7225 17.05C69.0492 16.4433 69.5018 15.9767 70.0805 15.65C70.6685 15.3233 71.3405 15.16 72.0965 15.16C72.8245 15.16 73.4732 15.3187 74.0425 15.636C74.6118 15.9533 75.0552 16.4013 75.3725 16.98C75.6898 17.5493 75.8485 18.2073 75.8485 18.954ZM74.1825 18.45C74.1732 17.862 73.9632 17.3907 73.5525 17.036C73.1418 16.6813 72.6332 16.504 72.0265 16.504C71.4758 16.504 71.0045 16.6813 70.6125 17.036C70.2205 17.3813 69.9872 17.8527 69.9125 18.45H74.1825ZM84.2231 16.168C84.2231 16.6627 84.1065 17.1293 83.8731 17.568C83.6398 18.0067 83.2665 18.366 82.7531 18.646C82.2398 18.9167 81.5818 19.052 80.7791 19.052H79.0151V23H77.4191V13.27H80.7791C81.5258 13.27 82.1558 13.4007 82.6691 13.662C83.1918 13.914 83.5791 14.2593 83.8311 14.698C84.0925 15.1367 84.2231 15.6267 84.2231 16.168ZM80.7791 17.75C81.3858 17.75 81.8385 17.6147 82.1371 17.344C82.4358 17.064 82.5851 16.672 82.5851 16.168C82.5851 15.104 81.9831 14.572 80.7791 14.572H79.0151V17.75H80.7791ZM87.3413 21.712H90.6313V23H85.7453V13.27H87.3413V21.712ZM99.176 13.27L95.956 19.472V23H94.36V19.472L91.126 13.27H92.904L95.158 18.044L97.412 13.27H99.176Z"
                fill="#58535E"
              />
              <path
                d="M132 15.5L127 20.5L122 15.5"
                stroke="#E6E6E8"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-f12 text-text-400 max-w-[300px] text-center">
            Based on how much vePLY a user owns, they may be able to receive up
            to 2.5x more PLY rewards.
          </div>
        </div>
        {/* End of dropDown info */}

        {/* Start Of text and btn */}
        <div className="flex justify-between items-end py-2 px-4">
          <div className="text-f14 text-text-500">How much PNLP to stake?</div>
          <div className="flex gap-2">
            <SimpleButton text="25%" />
            <SimpleButton text="35%" />
            <SimpleButton text="50%" />
          </div>
        </div>
        {/* end of text and btn */}

        {/* Start of Wallet app section */}
        <div className="border flex justify-between items-center bg-muted-200/10 border-border-500/50 rounded-2xl">
          <div className="w-[50%] flex flex-col py-3.5 px-4">
            <InputText />
            <div className="font-body4 text-text-400">40</div>
          </div>
          <div className="pr-5">
            <BtnWithWalletIcon text="500 PLP" />
          </div>
        </div>
        {/* end of Waller app section */}
      </div>
      {/* Button Stake */}
      <Button color={"primary"} onClick={() => {}}>
        Stake
      </Button>
      {/* end of Button Stake */}

      {/* start of notification panel */}

      <div className="border mt-4 rounded-2xl flex justify-between items-center pr-2 py-1.5 border-border-500 bg-card-300">
        <div className="flex gap-2 items-center pl-4">
          <CircularImageInfo imageArray={[token, token2]} />
          <span className="text-f14 text-white uppercase">CTEZ/PLENTY</span>
        </div>
        <BtnWithStakeIcon text={"3400 PLXP"} />
      </div>

      {/* end of notification panel */}
    </div>
  );
}
export function Unstaking(props: IUnstakingProps) {
  return (
    <div className="border rounded-2xl border-text-800 bg-card-200 px-3.5 pt-4 pb-6  mb-5">
      {/* staking UnStaking Switch */}
      <div className="flex items-center justify-between flex-row  relative">
        <div className="flex gap-2 items-center">
          <span className="relative ml-2 top-[3px]">
            <SwitchWithIcon
              isChecked={true}
              onChange={() => props.setStakingScreen(StakingScreenType.Staking)}
            />
          </span>
          <p className="text-f16 text-white">Unstake Liquidity</p>
        </div>
      </div>
      {/* end of switch */}

      {/* Start Of text and btn */}
      <div className="flex justify-between items-end py-2 px-4">
        <div className="text-f14 text-text-500">How much PNLP to unstake?</div>
        <div className="flex gap-2">
          <SimpleButton text="25%" />
          <SimpleButton text="35%" />
          <SimpleButton text="50%" />
        </div>
      </div>
      {/* end of text and btn */}

      {/* Start of Wallet app section */}
      <div className="border flex justify-between items-center bg-muted-200/10 border-border-500/50 mb-5 rounded-2xl">
        <div className="w-[50%] flex flex-col py-3.5 px-4">
          <InputText />
          <div className="font-body4 text-text-400">40</div>
        </div>
        <div className="pr-5">
          <BtnWithWalletIcon text="500 PLP" />
        </div>
      </div>
      {/* end of Waller app section */}

      {/* Button Stake */}
      <Button color={"primary"} onClick={() => {}}>
        Unstake
      </Button>
      {/* end of Button Stake */}
    </div>
  );
}

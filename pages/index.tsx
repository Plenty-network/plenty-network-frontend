import type { NextPage } from "next";
import logo from "../src/assets/logo.png";
import discord from "../src/assets/Discord.svg";
import twitter from "../src/assets/Twitter.svg";
import chat from "../src/assets/chat.svg";
import github from "../src/assets/Github.svg";
import medium from "../src/assets/medium.svg";
import partner from "../src/assets/partner.svg";

import PropTypes from "prop-types";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <div className="mx-auto md:max-w-[1200px] md:w-[1200px] text-center">
      <div className="mt-[40px]">
        <Image src={logo} width={"246px"} height={"77px"} />
      </div>
      <div className="shadow text-[54px] mt-[60px] font-[700]">Launching soon!</div>
      <div className="text-[20px] text-[#F7F7F7] mt-[10px] font-[400]">
        Preparing for mainnet, sit tight
      </div>
      <div className="progress mx-auto "></div>
      <div className="flex gap-10 mt-[60px] justify-center">
        <Image src={discord} />
        <Image src={twitter} />
        <Image src={medium} />
        <Image src={github} />
        <Image src={chat} />
      </div>
      <div className="flex gap-10 mt-[40px] justify-center">
        <Image src={partner} />
      </div>
    </div>
  );
};

export default Home;

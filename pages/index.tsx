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
    <div className="h-[100vh] relative mx-auto md:max-w-[1200px] md:w-[1200px] text-center">
      <div className="mt-[40px]">
        <Image src={logo} width={"246px"} height={"77px"} />
      </div>
      <div className=" text-[40px] md:text-[54px] mt-[60px] font-[700]">Launching soon!</div>
      <div className="text-[20px] text-[#F7F7F7] mt-[10px] font-[400]">
        Preparing for mainnet, sit tight
      </div>

      <div className="absolute bottom-[100px] w-full mx-auto ">
        <div className=" flex gap-10 mt-[60px] justify-center">
          <a
            href="https://discord.com/invite/9wZ4CuvkuJ"
            className="text-decoration-none"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <Image src={discord} />
          </a>
          <a
            href="https://twitter.com/plenty_network"
            className="text-decoration-none"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <Image src={twitter} />
          </a>
          <a
            href="https://medium.com/plenty-defi"
            className="text-decoration-none"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <Image src={medium} />
          </a>
          <a
            href="https://github.com/Plenty-DeFi"
            className="text-decoration-none"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <Image src={github} />
          </a>
          <a
            href="https://whitepaper.plenty.network/"
            className="text-decoration-none"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <Image src={chat} />
          </a>
        </div>
        <div className="flex gap-10 mt-[40px] justify-center">
          <Image src={partner} />
        </div>
      </div>
    </div>
  );
};

export default Home;

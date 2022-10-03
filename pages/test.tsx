import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { SideBarHOC } from "../src/components/Sidebar/SideBarHOC";
import TransactionSubmitted from "../src/components/TransactionSubmitted";
import { useAppDispatch } from "../src/redux";

const Test: NextPage = () => {
  const dispatch = useAppDispatch();
  const clickRedirectToaPage = () => {
    window.open("https://www.google.com", "_blank");
  };
  const [u,s]=useState(false);
  return (
    <>
      <Head>
        <title className="font-medium1">Plenty network</title>
        <meta name="description" content="plenty network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBarHOC>
        <div className="m-14 flex flex-col gap-10 border p-14 border-white">
          <button onClick={()=>s(true)}>Hello world</button>
          {u&&<TransactionSubmitted
          content="hosk"
          onBtnClick={()=>{}}
          setShow={s}
          show={u}
          
          />}
        </div>
      </SideBarHOC>
    </>
  );
};

export default Test;

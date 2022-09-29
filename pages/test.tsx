import type { NextPage } from "next";
import Head from "next/head";
import { FlashMessage, Flashtype } from "../src/components/FlashScreen";
import { SideBarHOC } from "../src/components/Sidebar/SideBarHOC";
import { useAppDispatch } from "../src/redux";
import { setFlashMessage } from "../src/redux/flashMessage/action";


const Test: NextPage = () => {
  const dispatch = useAppDispatch();
  
  return (
    <>
      <Head>
        <title className="font-medium1">Plenty network</title>
        <meta name="description" content="plenty network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBarHOC>
        <div className="m-14 flex flex-col gap-10 border p-14 border-white">
            <button onClick={()=>dispatch(setFlashMessage(true))} >Hello</button>

        </div>
      </SideBarHOC>
    </>
  );
};

export default Test;

import type { NextPage } from "next";
import Head from "next/head";
import HeadInfo from "../src/components/HeadInfo";
import { SideBarHOC } from "../src/components/Sidebar/SideBarHOC";
import { useAppDispatch } from "../src/redux";

const Test: NextPage = () => {
  const dispatch = useAppDispatch();
  const clickRedirectToaPage = () => {
    window.open("https://www.google.com", "_blank");
  };
  return (
    <>
      <Head>
        <title className="font-medium1">Plenty network</title>
        <meta name="description" content="plenty network" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SideBarHOC>
        <div className="m-14 flex flex-col gap-10 border p-14 border-white">
          <HeadInfo
            className="px-2 md:px-3"
            title="Vote"
            toolTipContent=""
            searchValue=""
            setSearchValue={() => {}}
          />
        </div>
      </SideBarHOC>
    </>
  );
};

export default Test;

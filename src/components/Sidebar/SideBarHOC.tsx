import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import { AppDispatch, store } from "../../redux";
import { FlashMessageHOC } from "../FlashScreen/FlashMessageHOC";
import NodeSelector from "../NodeSelector";
import { NotificationBar } from "../Notification";
import Banner from "./Banner";
import BottomNavigationBar from "./BottomNavBar";
import { SideBar } from "./Sidebar";
import { TopNavBar } from "./TopNavBar";
import { TopNavBarMobile } from "./TopNavBarMobile";
import "animate.css";
import { useDispatch } from "react-redux";
import { setClientHeight, setHeight, setScrollY } from "../../redux/walletLoading";

export interface ISideBarHOCProps {
  children: any;
  makeTopBarScroll?: boolean;
  isBribes?: boolean;
  isBribesLanding?: boolean;
}

export function SideBarHOC(props: ISideBarHOCProps) {
  const [isBanner, setIsBanner] = React.useState(true);

  const [showNotification, setShowNotification] = useState(false);
  const showNotificationClick = () => {
    setShowNotification(!showNotification);
  };
  const [showPopupModal, setShowPopupModal] = useState(false);
  const showPopupModalClick = () => {
    setShowPopupModal(!showPopupModal);
  };

  const dispatch = useDispatch<AppDispatch>();
  const onScroll = (e: any) => {
    dispatch(setScrollY(e.target.scrollTop));
    dispatch(setHeight(e.target.scrollHeight));
    dispatch(setClientHeight(e.target.clientHeight));
  };
  const [showNodeSelector, setNodeSelector] = useState(false);
  return (
    <>
      <FlashMessageHOC />
      <div className="flex flex-no-wrap flex-col">
        {isBanner && <Banner isBanner={isBanner} setIsBanner={setIsBanner} />}
        {!isMobile && (
          <TopNavBar
            setNodeSelector={setNodeSelector}
            setShowNotification={showNotificationClick}
            isLanding={props.isBribesLanding ? props.isBribesLanding : false}
            isBribes={props.isBribes ? props.isBribes : false}
            isBanner={isBanner}
          />
        )}
        {showNotification && !props.isBribesLanding && (
          <NotificationBar
            isBanner={isBanner}
            onhide={() => {
              setShowNotification(false);
            }}
          />
        )}
        <div className="flex flex-no-wrap">
          {!isMobile && !props.isBribes && <SideBar isBanner={isBanner} />}
          <div
            className={`mt-0 ${
              !isMobile && !props.isBribes ? "md:ml-[240px] md:w-[calc(100%_-_240px)]" : ""
            } w-full  md:static overflow-y-auto absolute h-[calc(100%_-_61px)] md:mb-0`}
          >
            <div
              onScroll={onScroll}
              className={`overflow-x-hidden h-screen   z-0  ${
                props.makeTopBarScroll || true
                  ? `static overflow-y-auto ${isBanner ? "pt-[100px]" : "pt-[64px]"} `
                  : "md:absolute fixed overflow-y-hidden top-16 !m-0  h-[calc(100%_-_121px)] md:h-[calc(100%_-_64px)] md:w-[calc(100%_-_240px)] w-full"
              }`}
            >
              {props.children}
            </div>
          </div>
        </div>
        {isMobile && !props.isBribes && <BottomNavigationBar />}
        {isMobile && (
          <>
            <Banner isBanner={isBanner} setIsBanner={setIsBanner} />
            <TopNavBarMobile
              setShowNotification={showNotificationClick}
              isBribes={props.isBribes ? props.isBribes : false}
              setNodeSelector={setNodeSelector}
              isBanner={isBanner}
            />
          </>
        )}
      </div>
      <NodeSelector show={showNodeSelector} setShow={setNodeSelector} />
    </>
  );
}

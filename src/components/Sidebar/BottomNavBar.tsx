import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { useAppDispatch } from "../../redux";
import { setbannerClicked } from "../../redux/walletLoading";
import { useOutsideClick } from "../../utils/outSideClickHook";
import { FooterInfoIcon } from "./FooterIconList";
import { HrefIcon } from "./LinkIconList";
import { FooterMenu } from "./Sidebar";
import { ISingleSideBarProps, SingleSideBar } from "./SideBarTabList";

export interface IBottomNavigationBarProps {}

export interface IBottomNavMenuProps extends IBottomMoreNavMenuProps {
  activeSubMenuPool: boolean;
  setActiveSubMenu: React.Dispatch<React.SetStateAction<MenuType>>;
  setActiveSubMenuPool: React.Dispatch<React.SetStateAction<boolean>>;
  subMenu: false | ISingleSideBarProps[] | undefined;
  link?: string;
}
export interface IBottomMoreNavMenuProps {
  onClick?: Function;
  active?: boolean;
  className?: string;
  ref?: any;
  text: string;
  iconName?: string;
}
enum MenuType {
  NoMenu = 0,
  MoreNavMenu = 1,
  Menu = 2,
}
export interface ISubMenuProps {}
export interface ISubMenuListProps {
  refWrapper?: any;
}
const mainMenu: Array<ISingleSideBarProps> = [
  {
    name: "Swap",
    iconName: "u_exchange",
    pathName: "/swap",
    activePathName: "/swap",
  },
  {
    name: "Pools",
    iconName: "pools",
    // pathName: "/pools",
    // activePathName: "/pools",
    subMenu: [
      {
        name: "v2",
        iconName: "pools",
        pathName: "/pools",
        activePathName: "/pools",
      },
      {
        name: "v3",
        iconName: "pools",
        pathName: "/pools/v3",
        activePathName: "/pools/v3",
      },
    ],
  },
  {
    name: "Vote",
    iconName: "lock_mobile",
    pathName: "/vote",
    activePathName: "/vote",
  },
];
export default function BottomNavigationBar(props: IBottomNavigationBarProps) {
  const [activeSubMenu, setActiveSubMenu] = React.useState(MenuType.NoMenu);
  const { pathname } = useRouter();
  const reff = React.useRef(null);
  useOutsideClick(reff, () => {
    setActiveSubMenuPool(false);
    setActiveSubMenu(MenuType.NoMenu);
  });
  const [activeSubMenuPool, setActiveSubMenuPool] = React.useState(false);
  return (
    <div
      className={`${
        activeSubMenu == MenuType.NoMenu ? "h-[60px]" : "h-screen"
      } topNavblurEffect flex items-end w-screen fixed bottom-0 bg-sideBar p-0 `}
    >
      <div className="bg-cardBackGround" ref={reff}>
        {activeSubMenu === MenuType.Menu && <SubMenuList />}
        {activeSubMenu === MenuType.MoreNavMenu && <MoreSubMenuList />}
        {activeSubMenuPool && <SubMenuForPool />}
        <div className="justify-between flex w-screen">
          <>
            {mainMenu.map((e) => (
              <MenuWithLink
                key={e.pathName}
                link={e.pathName}
                text={e.name}
                iconName={e.iconName}
                subMenu={e.subMenu}
                activeSubMenuPool={activeSubMenuPool}
                setActiveSubMenuPool={setActiveSubMenuPool}
                active={e.activePathName === pathname && activeSubMenu != MenuType.MoreNavMenu}
                setActiveSubMenu={setActiveSubMenu}
              />
            ))}
          </>
          <MenuNoLink
            onClick={() => {
              setActiveSubMenu((e) =>
                e === MenuType.MoreNavMenu ? MenuType.NoMenu : MenuType.MoreNavMenu
              );
              setActiveSubMenuPool(false);
            }}
            text={""}
            iconName={"moreMenu"}
            active={activeSubMenu === MenuType.MoreNavMenu}
          />
        </div>
      </div>
    </div>
  );
}

export function MenuWithLink(props: IBottomNavMenuProps) {
  if (props.subMenu) {
    return (
      <div
        className={`${
          props.active
            ? "bg-sideBarHover border-t-primary-500 text-white"
            : "border-t-borderColor text-text-250"
        } ${
          props.className
        } border-t-[1.5px] text-f10 flex-1 flex flex-col items-center text-center   px-[18px] py-[9px]   `}
        onClick={() => {
          props.setActiveSubMenuPool(!props.activeSubMenuPool);
          props.setActiveSubMenu(MenuType.NoMenu);
        }}
      >
        {props.iconName && (
          <Image
            alt={"alt"}
            className={props.active ? "" : "opacity-70"}
            src={`/assets/icon/${props.iconName}.svg`}
            height={"24px"}
            width={"24px"}
          />
        )}
        <p className="text-f1015">{props.text}</p>
      </div>
    );
  } else {
    return (
      <Link href={props.link ? props.link : ""}>
        <div
          className={`${
            props.active
              ? "bg-sideBarHover border-t-primary-500 text-white"
              : "border-t-borderColor text-text-250"
          } ${
            props.className
          } border-t-[1.5px] text-f10 flex-1 flex flex-col items-center text-center   px-[18px] py-[9px]   `}
        >
          {props.iconName && (
            <Image
              alt={"alt"}
              className={props.active ? "" : "opacity-70"}
              src={`/assets/icon/${props.iconName}.svg`}
              height={"24px"}
              width={"24px"}
            />
          )}
          <p className="text-f1015">{props.text}</p>
        </div>
      </Link>
    );
  }
}
export function SubMenuForPool() {
  return (
    <div className="w-screen flex flex-col text-f12 bg-topBar z-10">
      <div className=" hover:bg-sideBarHover border-t border-t-borderColor ">
        <SingleSideBar
          name="V2"
          className="px-9 justify-between"
          iconName="pools"
          pathName={"/pools"}
          isBottomMenu
        />
      </div>
      <div className=" hover:bg-sideBarHover border-t border-t-borderColor ">
        <SingleSideBar
          name="V3"
          className="px-9 justify-between"
          iconName="pools"
          pathName={"/pools/v3"}
          isBottomMenu
        />
      </div>
    </div>
  );
}
export function MenuNoLink(props: IBottomMoreNavMenuProps) {
  return (
    <div
      onClick={
        props.onClick
          ? () => {
              props.onClick && props.onClick();
            }
          : () => {}
      }
      className={`${
        props.active ? "bg-sideBarHover border-t-primary-500" : "border-t-borderColor"
      } ${
        props.className
      } border-t-[1.5px] text-f10 flex-1 flex flex-col items-center text-center gap-2  px-[18px] py-[9px]  `}
    >
      {props.iconName && (
        <Image
          alt={"alt"}
          className={props.active ? "opacity-100" : "opacity-70"}
          src={`/assets/icon/${props.iconName}.svg`}
          height={"24px"}
          width={"24px"}
        />
      )}
      <p>{props.text}</p>
    </div>
  );
}
export function BottomSubMenu(props: ISubMenuProps) {
  return (
    <div className="py-5 px-6 border-t border-t-borderColor hover:bg-sideBarHover hover:border-t-primary-500">
      Swap
    </div>
  );
}

export function SubMenuList(props: ISubMenuListProps) {
  return (
    <div className="w-screen flex flex-col text-f12 bg-topBar ">
      <BottomSubMenu />
    </div>
  );
}
export function MoreSubMenuList(props: ISubMenuListProps) {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(setbannerClicked(false));
  };
  return (
    <div
      className="w-screen flex flex-col text-f12 bg-topBar z-10"
      ref={props.refWrapper}
      onClick={handleClick}
    >
      {/*  */}

      {/*  */}
      <div className="px-9 hover:bg-sideBarHover ">
        <SingleSideBar
          name="Migrate"
          className="px-9 justify-between"
          iconName="migrate"
          pathName={"/migrate"}
          isBottomMenu
        />
      </div>
      <div className="px-9 hover:bg-sideBarHover border-t border-t-borderColor hover:border-t-primary-500">
        <SingleSideBar
          name="Airdrop"
          className="px-9 justify-between"
          iconName="airdrop"
          pathName={"/airdrop"}
          isBottomMenu
        />
      </div>
      <div className="px-9 border-t border-t-borderColor hover:bg-sideBarHover hover:border-t-primary-500">
        <SingleSideBar
          name="Bribe"
          className="px-9 justify-between"
          iconName="bribes"
          pathName={"/bribes"}
          isBottomMenu
          isHrefIcon={true}
          openNewPage={true}
        />
      </div>

      <div className="px-9 border-t border-t-borderColor  hover:bg-sideBarHover hover:border-t-primary-500">
        <SingleSideBar
          name="Bridge"
          className="px-9 justify-between"
          iconName="bridge"
          pathName={"https://bridge.plenty.network/"}
          isBottomMenu
          isHrefIcon={true}
          openNewPage={true}
        />
      </div>

      {/*  */}
      {/* <div className=" border-t border-t-borderColor hover:bg-sideBarHover hover:border-t-primary-500">
        <SingleSideBar name="Robocoin" className="px-9" iconName="roboIconMobile" isBottomMenu />
      </div> */}
      {/*  */}

      {/*  */}
      {/* <div className=" border-t border-t-borderColor hover:bg-sideBarHover hover:border-t-primary-500">
        <SingleSideBar name="Migrate" className="px-9" iconName="migrateIconMobile" isBottomMenu />
      </div> */}
      {/*  */}

      {/*  */}
      {/* <div className=" border-t border-t-borderColor hover:bg-sideBarHover hover:border-t-primary-500">
        <SingleSideBar name="Fiat" className="px-9" iconName="flateIconMobile" isBottomMenu />
      </div> */}

      <div className="">
        {FooterMenu.map((e, i) => (
          <HrefIcon name={e.name} href={e.href} key={`footer_${i}`} iconName={e.iconName} />
        ))}
      </div>

      <div className="px-5 border-t border-t-borderColor hover:bg-sideBarHover hover:border-t-primary-500">
        <FooterInfoIcon />
      </div>
    </div>
  );
}

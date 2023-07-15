import { useRouter } from "next/router";
import * as React from "react";
import { useAppDispatch } from "../../redux";
import { setbannerClicked } from "../../redux/walletLoading";
import { FooterInfoIcon } from "./FooterIconList";
import { HrefIcon, IHrefIconProps } from "./LinkIconList";
import { ISingleSideBarProps, SingleSideBar } from "./SideBarTabList";

export interface ISideBarProps {
  isBanner: boolean;
}
export const FooterMenu: Array<IHrefIconProps> = [
  {
    name: "Analytics",
    iconName: "VectorfooterMenu",
    href: "https://analytics.plenty.network/",
  },
  {
    name: "Docs",
    iconName: "VectorfooterMenu-1",
    href: "https://whitepaper.plenty.network/",
  },
  {
    name: "Feedback",
    iconName: "VectorfooterMenu-2",
    href: "https://tally.so/r/mOQg0M ",
  },
];

const MainMenu: Array<ISingleSideBarProps> = [
  {
    name: "Swap",
    iconName: "swap",
    pathName: "/swap",
    activePathName: "/swap",
  },
  {
    name: "Pools",
    iconName: "pools",
    link: "/pools/v3",

    subMenu: [
      {
        name: "v3",
        iconName: "pools",
        pathName: "/pools/v3",
        activePathName: "/pools/v3",
      },
      {
        name: "v2",
        iconName: "pools",
        pathName: "/pools",
        activePathName: "/pools",
      },
    ],
  },
  {
    name: "Vote",
    iconName: "lock",
    pathName: "/vote",
    activePathName: "/vote",
  },
  {
    name: "Migrate",
    iconName: "migrate",
    pathName: "/migrate",
    activePathName: "/migrate",
    isToolTip: true,
  },
  {
    name: "Airdrop",
    iconName: "airdrop",
    pathName: "/airdrop",
    activePathName: "/airdrop",
  },
  {
    name: "Bribe",
    iconName: "bribes",
    pathName: "/bribes",
    activePathName: "/bribes",
    isHrefIcon: true,
    openNewPage: true,
  },

  {
    name: "Bridge",
    iconName: "bridge",
    pathName: "https://bridge.plenty.network/",
    activePathName: "/bridge",
    isHrefIcon: true,
    openNewPage: true,
  },
];

export function SideBar(props: ISideBarProps) {
  const [activeMenu, setActiveMenu] = React.useState<string>("");
  const [openSubMenu, setOpenSubMenu] = React.useState(true);
  const { pathname } = useRouter();
  try {
    if (pathname == "/swap" || pathname == "/migrate")
      document.getElementsByTagName("body")[0].className = "swap";
    else document.getElementsByTagName("body")[0].className = "";
  } catch {}

  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(setbannerClicked(false));
  };
  return (
    <div
      className="fixed text-f14 bg-sideBar border-border-500/50 border-r shadow hidden md:block  "
      style={{
        height: `${props.isBanner ? "calc(100vh - 103px)" : "calc(100vh - 64px)"}`,
        width: "240px",
        marginTop: `${props.isBanner ? "103px" : "64px"}`,
      }}
    >
      <div className="flex-col justify-between h-full flex overflow-y-auto">
        <div className=" flex-1 md:h-[calc(100%_-_215px)] overflow-y-auto" onClick={handleClick}>
          {MainMenu.map((menuItem, index) => (
            <SingleSideBar
              name={menuItem.name}
              iconName={menuItem.iconName}
              key={`menuItem${index}`}
              onClick={() =>
                activeMenu === `menuItem${index}`
                  ? setActiveMenu("")
                  : setActiveMenu(`menuItem${index}`)
              }
              link={menuItem.link}
              isActive={pathname === menuItem.activePathName}
              isMenuOpen={openSubMenu}
              setOpenSubMenu={setOpenSubMenu}
              subMenu={menuItem.subMenu ? menuItem.subMenu : false}
              isToolTip={menuItem.isToolTip}
              pathName={menuItem.pathName}
              isHrefIcon={menuItem.isHrefIcon}
              openNewPage={menuItem.openNewPage}
            />
          ))}
        </div>
        <div>
          <div className=" border-border-500/50 border-t">
            {FooterMenu.map((e, i) => (
              <HrefIcon name={e.name} href={e.href} key={`footer_${i}`} iconName={e.iconName} />
            ))}
          </div>
          <div className=" border-t border-border-500/50 ">
            <FooterInfoIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

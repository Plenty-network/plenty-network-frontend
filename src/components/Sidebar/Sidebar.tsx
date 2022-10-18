import { useRouter } from "next/router";
import * as React from "react";
import { store } from "../../redux";
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
    href: "https://plenty-analytics-test.netlify.app/",
  },
  {
    name: "Docs",
    iconName: "VectorfooterMenu-1",
    href: "https://whitepaper.plenty.network/",
  },
  {
    name: "Feedback",
    iconName: "VectorfooterMenu-2",
    href: "https://discord.com/invite/9wZ4CuvkuJ",
  },
];

// const MainMenu: Array<ISingleSideBarProps> = [
//   {
//     name: 'Swap',
//     iconName: 'swap',
//     pathName: '/Swap',
//   },
//   {
//     name: 'Pools',
//     iconName: 'pools',
//     pathName: '/pools',
//   },
//   {
//     name: 'komm',
//     iconName: 'swap',
//     subMenu: [
//       {
//         name: 'swap',
//         iconName: 'swap',
//         pathName: './limk',
//       },
//       {
//         name: 'swap',
//         iconName: 'swap',
//         pathName: './limk',
//       },
//       {
//         name: 'swap',
//         iconName: 'swap',
//         pathName: './limk',
//       },
//       {
//         name: 'swap',
//         iconName: 'swap',
//         pathName: './limk',
//       },
//       {
//         name: 'swap',
//         iconName: 'swap',
//         pathName: './limk',
//       },
//       {
//         name: 'sap',
//         iconName: 'swap',
//         pathName: './limk',
//       },
//       {
//         name: 'swap',
//         iconName: 'swap',
//         pathName: './limk',
//       },
//     ],
//   },
// {
//   name: 'Earn',
//   iconName: 'swap',
//   subMenu: [
//     {
//       name: 'swap',
//       iconName: 'swap',
//       pathName: './limk',
//     },
//   ],
// },
//   {
//     name: 'kokmm',
//     iconName: 'swap',
//     pathName: './limk',
//   },
//   {
//     name: 'mopp',
//     iconName: 'swap',
//     pathName: './limk',
//   },
// ];

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
    pathName: "/pools",
    activePathName: "/pools",
  },
  {
    name: "Vote",
    iconName: "lock",
    pathName: "/vote",
    activePathName: "/vote",
  },
  {
    name: "Bribes",
    iconName: "bribes",
    pathName: "/bribes",
    activePathName: "/bribes",
    isHrefIcon: true,
    openNewPage: true,
  },
];

export function SideBar(props: ISideBarProps) {
  const [activeMenu, setActiveMenu] = React.useState<string>("");
  const { pathname } = useRouter();
  try {
    if (pathname == "/swap") document.getElementsByTagName("body")[0].className = "swap";
    else document.getElementsByTagName("body")[0].className = "";
  } catch {}
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
        <div className=" flex-1 md:h-[calc(100%_-_215px)] overflow-y-auto">
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
              isActive={pathname === menuItem.activePathName}
              isMenuOpen={activeMenu === `menuItem${index}`}
              subMenu={menuItem.subMenu ? menuItem.subMenu : false}
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

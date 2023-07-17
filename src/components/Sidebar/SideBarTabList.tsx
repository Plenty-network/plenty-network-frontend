import Image from "next/image";
import Link from "next/link";
import Config from "../../config/config";
import TooltipViolet from "../Migrate/TooltipViolet";
import { Position, ToolTip, TooltipType } from "../Tooltip/TooltipAdvanced";
import { useRouter } from "next/router";

export interface ISingleSideBarProps {
  name: string;
  iconName?: string;
  link?: string;
  pathName?: string;
  subMenu?: ISingleSideBarProps[] | false;
  className?: string;
  onClick?: () => void | Promise<void>;
  isMenuOpen?: boolean;
  isBottomMenu?: boolean;
  isActive?: boolean;
  activePathName?: string;
  isHrefIcon?: boolean;
  openNewPage?: boolean;
  isToolTip?: boolean;
  isSubmenu?: boolean;
  setOpenSubMenu?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SingleSideBar(props: ISingleSideBarProps) {
  const router = useRouter();

  if (props.pathName) {
    return (
      <Link className={`md:flex w-full flex-col ${props?.className}`} href={props.pathName}>
        <a target={props.openNewPage ? "_blank" : ""} rel="noopener noreferrer">
          <ToolTip
            position={Position.bottom}
            disable={props.isToolTip ? false : true}
            toolTipChild={
              <TooltipViolet
                rate1={`1 WRAP = ${Config.EXCHANGE_TOKENS.WRAP.exchangeRate} PLY`}
                rate2={`1 PLENTY = ${Config.EXCHANGE_TOKENS.PLENTY.exchangeRate} PLY`}
              />
            }
            type={TooltipType.withoutBorder}
          >
            <div
              className={`flex   items-center justify-between  ${
                props.pathName === router.pathname ? "sideNavactive text-white" : "text-text-250"
              } ${
                props.isSubmenu
                  ? "pl-[26px] pr-6 h-[42px] w-[85%] ml-auto "
                  : !props.isBottomMenu
                  ? "pl-6 pr-[20px] h-[50px] w-full"
                  : "h-[50px]"
              } text-gray-300 hover:text-gray-500 cursor-pointer items-center  hover:bg-muted-250/60 ${
                !props.isBottomMenu ? "border-x-2" : ""
              } border border-transprent `}
            >
              <div className="flex  gap-4">
                {props.iconName && (
                  <Image
                    alt={"alt"}
                    className={props.isActive ? "opacity-100" : "opacity-70"}
                    src={`/assets/icon/${props.iconName}.svg`}
                    height={"20px"}
                    width={"20px"}
                  />
                )}
                <p>{props.name}</p>
              </div>
              {props.isHrefIcon && (
                <p className="w-[11px] h-[11px] relative -top-1 ml-auto ">
                  <Image
                    alt={"alt"}
                    src={"/assets/icon/HrefIcon.svg"}
                    height={"15px"}
                    width={"15px"}
                  />
                </p>
              )}
              {props.subMenu && props.subMenu.length && (
                <Image
                  alt={"alt"}
                  src={props.isMenuOpen ? "/assets/icon/UpArrow.svg" : "/assets/icon/DownArrow.svg"}
                  height={"8px"}
                  width={"11px"}
                />
              )}
            </div>{" "}
          </ToolTip>
        </a>
      </Link>
    );
  }

  return (
    <Link
      className={`md:flex w-full flex-col ${props?.className}`}
      href={props.link ? props.link : "/pools"}
    >
      <div className={`flex flex-col ${props?.className}`}>
        <div
          className={`flex w-full items-center justify-between h-[50px] ${
            props.isActive ? "sideNavactive text-white" : "text-text-250"
          } ${
            !props.isBottomMenu ? "px-6" : ""
          } text-gray-300 hover:text-gray-500 cursor-pointer items-center  hover:bg-muted-250/60 ${
            !props.isBottomMenu ? "border-x-2" : ""
          } border border-transprent `}
        >
          <div className="flex gap-4">
            {props.iconName && (
              <Image
                alt={"alt"}
                className={props.isActive ? "opacity-100" : "opacity-70"}
                src={`/assets/icon/${props.iconName}.svg`}
                height={"20px"}
                width={"20px"}
              />
            )}
            <p>{props.name}</p>
            {props.isHrefIcon && (
              <Image alt={"alt"} src={"/assets/icon/HrefIcon.svg"} height={"15px"} width={"15px"} />
            )}
          </div>
          {props.subMenu && props.subMenu.length && (
            <Image
              alt={"alt"}
              src={props.isMenuOpen ? "/assets/icon/UpArrow.svg" : "/assets/icon/DownArrow.svg"}
              height={"8px"}
              width={"11px"}
              onClick={() => props.setOpenSubMenu && props.setOpenSubMenu(!props.isMenuOpen)}
            />
          )}
        </div>
        {props.subMenu && props.isMenuOpen && props.subMenu.length && (
          <div>
            {props.subMenu.map((submenuItem, index) => (
              <SingleSideBar
                name={submenuItem.name}
                className="ml-8 border-l-2 border-borderColor"
                key={`submenu_${index}`}
                pathName={submenuItem.pathName}
                isSubmenu={true}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

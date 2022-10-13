import Image from "next/image";
import Link from "next/link";

export interface ISingleSideBarProps {
  name: string;
  iconName?: string;
  pathName?: string;
  subMenu?: ISingleSideBarProps[] | false;
  className?: string;
  onClick?: () => void | Promise<void>;
  isMenuOpen?: boolean;
  isBottomMenu?: boolean;
  isActive?: boolean;
  activePathName?: string;
  isHrefIcon?: boolean;
}

export function SingleSideBar(props: ISingleSideBarProps) {
  if (props.pathName) {
    return (
      <Link className={`flex flex-col ${props?.className}`} href={props.pathName}>
        <div
          className={`flex w-full items-center justify-between h-[50px] ${
            props.isActive ? "sideNavactive text-white" : "text-text-250"
          } ${
            !props.isBottomMenu ? "px-6" : ""
          } text-gray-300 hover:text-gray-500 cursor-pointer items-center  hover:bg-muted-250/60 ${
            !props.isBottomMenu ? "border-x-2" : ""
          } border border-transprent `}
        >
          <div className="flex  gap-4">
            {props.iconName && (
              <Image
                alt={"alt"}
                className={props.isActive ? "opacity-100" : "opacity-40"}
                src={`/assets/icon/${props.iconName}.svg`}
                height={"20px"}
                width={"20px"}
              />
            )}
            <p>{props.name}</p>
            {props.isHrefIcon && (
              <p className="w-[11px] h-[11px] relative top-px ml-20">
                <Image
                  alt={"alt"}
                  src={"/assets/icon/HrefIcon.svg"}
                  height={"15px"}
                  width={"15px"}
                />
              </p>
            )}
          </div>
          {props.subMenu && props.subMenu.length && (
            <Image
              alt={"alt"}
              src={props.isMenuOpen ? "/assets/icon/UpArrow.svg" : "/assets/icon/DownArrow.svg"}
              height={"8px"}
              width={"11px"}
            />
          )}
        </div>
      </Link>
    );
  }

  return (
    <div className={`flex flex-col ${props?.className}`} onClick={props.onClick}>
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
              className={props.isActive ? "opacity-100" : "opacity-40"}
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

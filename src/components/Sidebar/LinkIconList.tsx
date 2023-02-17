import clsx from "clsx";
import Image from "next/image";

export interface IHrefIconProps {
  name: string;
  href: string;
  iconName: string;
}

export function HrefIcon(props: IHrefIconProps) {
  return props.href === "" ? (
    <div
      className={clsx(
        "flex w-full items-center justify-between h-[50px] px-9 md:px-6 border-t border-t-borderColor md:border-t-0 text-gray-300 hover:text-gray-500  items-center  hover:bg-muted-250/60 md:border-x-2 border border-transprent ",
        props.href === "" ? "cursor-not-allowed" : "cursor-pointer"
      )}
    >
      <div className="flex gap-4">
        <Image
          alt={"alt"}
          src={`/assets/icon/${props.iconName}.svg`}
          height={"20px"}
          width={"20px"}
        />
        <p className="text-text-250">{props.name}</p>
      </div>
      <Image alt={"alt"} src={"/assets/icon/HrefIcon.svg"} height={"11.67px"} width={"16.66px"} />
    </div>
  ) : (
    <div>
      <a
        href={props.href}
        target="_blank"
        rel="noreferrer"
        className={clsx(
          "flex w-full items-center  h-[50px] px-9 xl:px-6 border-t border-t-borderColor xl:border-t-0 text-gray-300 hover:text-gray-500  items-center  hover:bg-muted-250/60 md:border-x-2 border border-transprent ",
          props.href === "" ? "cursor-not-allowed" : "cursor-pointer"
        )}
      >
        <div className="flex gap-4">
          <Image
            alt={"alt"}
            src={`/assets/icon/${props.iconName}.svg`}
            height={"20px"}
            width={"20px"}
          />
          <p className="text-text-250">{props.name}</p>
        </div>
        <div className="w-[11px] h-[11px]  ml-auto ">
          <Image alt={"alt"} src={"/assets/icon/HrefIcon.svg"} height={"15px"} width={"15px"} />
        </div>
      </a>
    </div>
  );
}

import Image from "next/image";

export interface IHrefIconProps {
  name: string;
  href: string;
  iconName: string;
}

export function HrefIcon(props: IHrefIconProps) {
  return (
    <div>
      <a
        href={props.href}
        target="_blank"
        rel="noreferrer"
        className="flex w-full justify-between py-3.5 px-6 border-t border-t-borderColor md:border-t-0 text-gray-300 hover:text-gray-500 cursor-pointer items-center  hover:hover:bg-muted-250/60 md:border-x-2 border border-transprent "
      >
        <div className="flex gap-4">
          <Image
            alt={"alt"}
            src={`/assets/icon/${props.iconName}.svg`}
            height={"11.67px"}
            width={"16.66px"}
          />
          <p className="text-text-250" >{props.name}</p>
        </div>
        <Image alt={"alt"} src={"/assets/icon/HrefIcon.svg"} height={"11.67px"} width={"16.66px"} />
      </a>
    </div>
  );
}

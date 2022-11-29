import * as React from "react";

import { IToken } from "./types";
import Image from "next/image";
import { tEZorCTEZtoUppercase } from "../../api/util/helpers";

export function Token(props: IToken) {
  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="mr-2 relative top-0.5">
          <Image alt={"alt"} src={getImagesPath(props.value)} width={"20px"} height={"20px"} />
        </div>
        <div className="font-subtitle3 text-white">{tEZorCTEZtoUppercase(props.value)}</div>
      </div>
    </>
  );
}

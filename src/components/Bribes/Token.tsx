import * as React from "react";

import { IToken } from "./types";
import Image from "next/image";
import { changeSource, tEZorCTEZtoUppercase } from "../../api/util/helpers";
import { tokenIcons } from "../../constants/tokensList";
import { useAppSelector } from "../../redux";

export function Token(props: IToken) {
  const tokens = useAppSelector((state) => state.config.tokens);
  const getImagesPath = (name: string, isSvg?: boolean) => {
    if (isSvg) return `/assets/tokens/${name}.svg`;
    if (name) return `/assets/tokens/${name.toLowerCase()}.png`;
    else return "";
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="mr-2 relative top-0.5">
          <img
            alt={"alt"}
            src={
              tokenIcons[props.value]
                ? tokenIcons[props.value].src
                : tokens[props.value.toString()]?.iconUrl
                ? tokens[props.value.toString()].iconUrl
                : `/assets/Tokens/fallback.png`
            }
            width={"20px"}
            height={"20px"}
            onError={changeSource}
          />
        </div>
        <div className="font-subtitle3 text-white">{tEZorCTEZtoUppercase(props.value)}</div>
      </div>
    </>
  );
}

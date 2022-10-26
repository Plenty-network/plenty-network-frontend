import * as React from "react";
import { isMobile } from "react-device-detect";
import { PopUpModal } from "./popupModal";

export interface IVideoModalProps {
  closefn: Function;
  linkString: string;
}

export function VideoModal(props: IVideoModalProps) {
  const { closefn, linkString } = props;
  const width = window.innerWidth - 20;
  const height = (9 / 16) * width;
  return (
    <div>
      <PopUpModal
        isFullSizeOnMobile
        Name={"video"}
        onhide={closefn}
        className="md:w-max w-screen max-w-none md:h-max "
      >
        <div className="modal-video-movie-wrap" onClick={() => closefn(false)}></div>
        <div>
          {!isMobile ? (
            <iframe
              width="560"
              height="315"
              src={`//www.youtube.com/embed/${linkString}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <iframe
              width={width < 560 ? width : 560}
              height={height < 315 ? height : 315}
              src={`//www.youtube.com/embed/${linkString}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="autoplay; accelerometer; autoplay; clipboard-write; encrypted-media; "
              allowFullScreen
            ></iframe>
          )}
        </div>
      </PopUpModal>
    </div>
  );
}

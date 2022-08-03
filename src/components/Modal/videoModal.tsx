import * as React from 'react';
import { PopUpModal } from './popupModal';

export interface IVideoModalProps {
    closefn:Function;
    linkString:string;
}


export function VideoModal (props: IVideoModalProps) {
    const {closefn,linkString}=props;
  return (
    <div>
      <PopUpModal onhide={closefn} className='w-max max-w-none h-max ' >
       <div className="modal-video-movie-wrap"  onClick={()=>closefn(false)}>
       <iframe width="560" height="315" src={`//www.youtube.com/embed/${linkString}?autoplay=1`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      </PopUpModal>
    </div>
  );
}

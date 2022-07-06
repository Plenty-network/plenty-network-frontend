import * as React from 'react';

export interface IPopUpModalProps {
  children: React.ReactNode;
  onhide?: Function;
  title: String;
}

export function PopUpModal(props: IPopUpModalProps) {
  return (
    <div className="absolute top-0 left-0 z-30 w-screen h-screen topNavblurEffect flex items-center justify-center fade-in-3">
      <div
        className="broder   relative border-popUpNotification
       w-[calc(100vw_-_38px)]
       max-w-[460px] 
       h-[576px] 
       bg-sideBar
       bord
       rounded-md
       border
       flex 
       flex-col
       px-6
       py-5
       "
      >
        <div
          className="absolute right-0  px-6 cursor-pointer hover:opacity-90 hover:scale-90"
          onClick={() => props.onhide && props.onhide()}
        >
          {/* close btn */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.05745 7.00014L12.7825 2.28264C12.9237 2.14141 13.003 1.94987 13.003 1.75014C13.003 1.55041 12.9237 1.35887 12.7825 1.21764C12.6412 1.07641 12.4497 0.99707 12.25 0.99707C12.0502 0.99707 11.8587 1.07641 11.7175 1.21764L6.99995 5.94264L2.28245 1.21764C2.14123 1.07641 1.94968 0.99707 1.74995 0.99707C1.55023 0.99707 1.35868 1.07641 1.21745 1.21764C1.07623 1.35887 0.996886 1.55041 0.996886 1.75014C0.996886 1.94987 1.07623 2.14141 1.21745 2.28264L5.94245 7.00014L1.21745 11.7176C1.14716 11.7874 1.09136 11.8703 1.05329 11.9617C1.01521 12.0531 0.995605 12.1511 0.995605 12.2501C0.995605 12.3491 1.01521 12.4472 1.05329 12.5386C1.09136 12.63 1.14716 12.7129 1.21745 12.7826C1.28718 12.8529 1.37013 12.9087 1.46152 12.9468C1.55292 12.9849 1.65095 13.0045 1.74995 13.0045C1.84896 13.0045 1.94699 12.9849 2.03839 12.9468C2.12978 12.9087 2.21273 12.8529 2.28245 12.7826L6.99995 8.05764L11.7175 12.7826C11.7872 12.8529 11.8701 12.9087 11.9615 12.9468C12.0529 12.9849 12.1509 13.0045 12.25 13.0045C12.349 13.0045 12.447 12.9849 12.5384 12.9468C12.6298 12.9087 12.7127 12.8529 12.7825 12.7826C12.8527 12.7129 12.9085 12.63 12.9466 12.5386C12.9847 12.4472 13.0043 12.3491 13.0043 12.2501C13.0043 12.1511 12.9847 12.0531 12.9466 11.9617C12.9085 11.8703 12.8527 11.7874 12.7825 11.7176L8.05745 7.00014Z"
              fill="white"
            />
          </svg>
        </div>

        <div className="">{props.title}</div>
        {props.children}
      </div>
    </div>
  );
}

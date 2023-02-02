// import "./App.css";
import WertWidget from "@wert-io/widget-initializer";
import React from "react";
import { isMobile } from "react-device-detect";
import { useAppSelector } from "../../redux";
import { PopUpModal } from "../Modal/popupModal";
export interface Iprops {
  hide: React.Dispatch<React.SetStateAction<boolean>>;
}
function WertWidgetPopup(props: Iprops) {
  const address = useAppSelector((state) => state.wallet.address);

  console.log("address = ");
  console.log(address);

  if (address != null && address.startsWith("tz") && address.length === 36) {
    // Parameters for wertUI initialization
    const wertParams = {
      partner_id: "01FG3WGQT0E33RJJQ1E88MKCR4",
      address: address,
      origin: "https://widget.wert.io",
      currency: "USD",
      commodity: "XTZ",
      color_background: "#090015",
      color_buttons: "#9D5CFF",
      color_buttons_text: "#000",
      buttons_border_radius: "8",
      color_main_text: "#FFFFFF",
      color_secondary_text: "#958E99",
      color_secondary_buttons_hover: "#150E1E",
      color_secondary_buttons: "rgb(157 92 255 / 0.3)",
      color_icons: "#958E99",
      color_links: "#9D5CFF",
    };
    const wertWidget = new WertWidget(wertParams);
    return (
      <PopUpModal
        isFullSizeOnMobile
        onhide={() => props.hide(false)}
        className="w-[100%] px-0 md:w-[540px] md:max-w-[540px] "
      >
        <div className="mt-2 inner">
          <iframe
            src={wertWidget.getEmbedUrl()}
            className="inner"
            allow="camera;"
            title="Wert"
            style={{
              width: isMobile ? "100%" : "500px",
              height: isMobile ? "540px" : "520px",
              border: "0px",
            }}
          ></iframe>
        </div>
      </PopUpModal>
    );
  } else {
    return (
      <div className="App">
        <h1>You seem have enterd a wrong wallet address</h1>
      </div>
    );
  }
}

export default WertWidgetPopup;

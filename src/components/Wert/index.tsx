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
      commodities: ["DOGA", "XTZ", "EURL"],
      color_background: "#090015",
      color_buttons: "#9D5CFF",
      color_buttons_text: "#000",
      buttons_border_radius: "8",
      color_main_text: "#FFFFFF",
      // color_secondary_text: "#958E99",
      //color_secondary_buttons_hover: "#fff",
      color_secondary_buttons_text: "#CFCED1",
      color_secondary_buttons: "#0f051d",
      color_icons: "#958E99",
      color_links: "#9D5CFF",
      color_scroll_thumb: "#1F1233",
      color_scroll_track: "#000",
      color_buttons_shadow: "#000000",
      color_main_text_inactive: "#1F0E38",
      color_buttons_inactive: "#230c44",
    };
    const wertWidget = new WertWidget(wertParams);
    return (
      <PopUpModal
        isFullSizeOnMobile
        Name={"videop"}
        onhide={() => props.hide(false)}
        className="w-[100%] px-0 pb-0 md:w-[550px] md:max-w-[550px] "
      >
        <div className="-mt-[18px] mr-5 inner ">
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

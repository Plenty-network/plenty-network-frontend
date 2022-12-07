import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Button from "../Button/Button";
/**
 *  Create a custom wallet connect button by extending the ConnectButton component provided by RainbowKit.
 */
const EvmWalletButton = (): JSX.Element => {
  return (
    <ConnectButton.Custom>
      {/* Options provided by RainbowKit for customising [Refer RainbowKit docs for more options if needed] */}
      {({ account, chain, openChainModal, openConnectModal, mounted }) => {
        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <Button color="primary" onClick={openConnectModal} width="w-full">
                    Connect to wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button color="primary" onClick={openChainModal} width="w-full">
                    Wrong network
                  </Button>
                );
              }
              // TODO: Add the condition when wallet is not eligible
              return true ? (
                <Button color="primary" width="w-full" onClick={() => {}}>
                  Claim from tezos wallet
                </Button>
              ) : (
                <Button color="disabled" width="w-full">
                  Your wallet is not eligible
                </Button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default EvmWalletButton;

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Button from "../Button/Button";

const EvmWalletButton = (): JSX.Element => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
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
              // <div style={{ display: "flex", gap: 12 }}>
              //   <button
              //     onClick={openChainModal}
              //     style={{ display: "flex", alignItems: "center" }}
              //     type="button"
              //   >
              //     {chain.hasIcon && (
              //       <div
              //         style={{
              //           background: chain.iconBackground,
              //           width: 12,
              //           height: 12,
              //           borderRadius: 999,
              //           overflow: "hidden",
              //           marginRight: 4,
              //         }}
              //       >
              //         {chain.iconUrl && (
              //           <Image
              //             alt={chain.name ?? "Chain icon"}
              //             src={chain.iconUrl}
              //             width={12}
              //             height={12}
              //           />
              //         )}
              //       </div>
              //     )}
              //     {chain.name}
              //   </button>

              //   <button onClick={openAccountModal} type="button">
              //     {account.displayName}
              //     {account.displayBalance ? ` (${account.displayBalance})` : ""}
              //   </button>
              // </div>
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default EvmWalletButton;

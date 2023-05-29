import axios from "axios";
import BigNumber from "bignumber.js";
import { OpKind } from "@taquito/taquito";
import { Approvals } from "@plenty-labs/v3-sdk";
import Config from "../../config/config";
import { getV3DexAddress } from "../../api/util/fetchConfig";
import { BalanceNat, TokenStandard } from "./types";
import { dappClient } from "../../common/walletconnect";
import { store } from "../../redux";
import { createPositionInstance } from "../../api/v3/helper";

export const LiquidityOperation = async (
  lowerTick: number,
  upperTick: number,
  tokenXSymbol: string,
  tokenYSymbol: string,
  deadline: number, //in seconds timestamp
  maximumTokensContributed: BalanceNat
): Promise<any> => {
  try {
    let configResponse: any = await axios.get(Config.CONFIG_LINKS.testnet.TOKEN);
    const Tezos = await dappClient().tezos();
    const state = store.getState();
    const TOKENS = state.config.tokens;
    let amountTokenX = maximumTokensContributed.x;
    let amountTokenY = maximumTokensContributed.y;

    amountTokenX = amountTokenX.multipliedBy(new BigNumber(10).pow(TOKENS[tokenXSymbol].decimals));

    amountTokenY = amountTokenX.multipliedBy(new BigNumber(10).pow(TOKENS[tokenYSymbol].decimals));

    const contractAddress = getV3DexAddress(tokenXSymbol, tokenYSymbol);
    const contractInstance = await Tezos.wallet.at(contractAddress);

    const tokenX = await Tezos.wallet.at(configResponse[tokenXSymbol].address);
    const tokenY = await Tezos.wallet.at(configResponse[tokenYSymbol].address);
    let createPosition = await createPositionInstance(
      amountTokenX,
      amountTokenY,
      lowerTick,
      upperTick,
      tokenXSymbol,
      tokenYSymbol,
      deadline,
      maximumTokensContributed
    );

    if (
      TOKENS[tokenXSymbol].standard === TokenStandard.FA12 &&
      TOKENS[tokenYSymbol].standard === TokenStandard.FA2
    ) {
      const op = await Tezos.wallet
        .batch([
          {
            kind: OpKind.TRANSACTION,
            // @ts-ignore
            ...Approvals.approveFA12(contractAddress, amountTokenX.decimalPlaces(0, 1)),
          },
          {
            kind: OpKind.TRANSACTION,
            // @ts-ignore
            ...Approvals.updateOperatorsFA2(tokenY, [
              {
                add_operator: {
                  owner: await Tezos.wallet.pkh(),
                  token_id: configResponse.tokenYSymbol.tokenId,
                  operator: contractInstance.address,
                },
              },
            ]),
          },
          {
            kind: OpKind.TRANSACTION,
            ...createPosition,
          },
        ])
        .send();
      await op.confirmation();
    } else if (
      TOKENS[tokenXSymbol].standard === TokenStandard.FA2 &&
      TOKENS[tokenYSymbol].standard === TokenStandard.FA12
    ) {
      const op = await Tezos.wallet
        .batch([
          {
            kind: OpKind.TRANSACTION,
            // @ts-ignore
            ...Approvals.updateOperatorsFA2(tokenX, [
              {
                add_operator: {
                  owner: await Tezos.wallet.pkh(),
                  token_id: configResponse.tokenXSymbol.tokenId,
                  operator: contractInstance.address,
                },
              },
            ]),
          },
          {
            kind: OpKind.TRANSACTION,
            // @ts-ignore
            ...Approvals.approveFA12(contractAddress, amountTokenY.decimalPlaces(0, 1)),
          },
          {
            kind: OpKind.TRANSACTION,
            ...createPosition,
          },
        ])
        .send();
      await op.confirmation();
    } else if (
      TOKENS[tokenXSymbol].standard === TokenStandard.FA12 &&
      TOKENS[tokenYSymbol].standard === TokenStandard.FA12
    ) {
      const op = await Tezos.wallet
        .batch([
          {
            kind: OpKind.TRANSACTION,
            // @ts-ignore
            ...Approvals.approveFA12(contractAddress, amountTokenX.decimalPlaces(0, 1)),
          },
          {
            kind: OpKind.TRANSACTION,
            // @ts-ignore
            ...Approvals.approveFA12(contractAddress, amountTokenY.decimalPlaces(0, 1)),
          },
          {
            kind: OpKind.TRANSACTION,
            ...createPosition,
          },
        ])
        .send();
      await op.confirmation();
    } else if (
      TOKENS[tokenXSymbol].standard === TokenStandard.FA2 &&
      TOKENS[tokenYSymbol].standard === TokenStandard.FA2
    ) {
      const op = await Tezos.wallet
        .batch([
          {
            kind: OpKind.TRANSACTION,
            // @ts-ignore
            ...Approvals.updateOperatorsFA2(tokenX, [
              {
                add_operator: {
                  owner: await Tezos.wallet.pkh(),
                  token_id: configResponse.tokenXSymbol.tokenId,
                  operator: contractInstance.address,
                },
              },
            ]),
          },
          {
            kind: OpKind.TRANSACTION,
            // @ts-ignore
            ...Approvals.updateOperatorsFA2(tokenY, [
              {
                add_operator: {
                  owner: await Tezos.wallet.pkh(),
                  token_id: configResponse.tokenYSymbol.tokenId,
                  operator: contractInstance.address,
                },
              },
            ]),
          },
          {
            kind: OpKind.TRANSACTION,
            ...createPosition,
          },
        ])
        .send();
      await op.confirmation();
    }
  } catch (error) {
    console.log("v3 error: ", error);
  }
};

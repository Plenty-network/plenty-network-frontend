import axios from 'axios';
import BigNumber from 'bignumber.js';
import { OpKind, WalletParamsWithKind } from "@taquito/taquito";
import { PositionManager, Approvals } from "@plenty-labs/v3-sdk";
import Config from "../../config/config";
import { getDexAddress } from "../../api/util/fetchConfig";
import { BalanceNat, Contract, TokenStandard } from './types';
import { calculateliquidity, calculateWitnessValue } from "../../api/v3/helper";
import { connectedNetwork, dappClient } from "../../common/walletconnect";
import { store } from "../../redux";

export const createPosition = async (amountTokenX: BigNumber, amountTokenY: BigNumber, lowerTick: number, upperTick: number, tokenXSymbol: string, tokenYSymbol: string, deadline: number, maximumTokensContributed: BalanceNat
    ): Promise<any>  => {
      try {
        let configResponse :any = await axios.get(Config.CONFIG_LINKS.testnet.TOKEN);
        const Tezos = await dappClient().tezos();
        const state = store.getState();
        const TOKENS = state.config.tokens;

        const contractAddress = getDexAddress(tokenXSymbol, tokenYSymbol);
        const contractInstance = await Tezos.wallet.at(contractAddress);
        const tokenX = await Tezos.wallet.at(configResponse.tokenXSymbol.address);
        const tokenY = await Tezos.wallet.at(configResponse.tokenYSymbol.address);
        
        let amount = {
            x: amountTokenX,
            y: amountTokenY
        }
        let liquidity = await calculateliquidity(amount, lowerTick, upperTick, tokenXSymbol, tokenYSymbol )

        let lowerTickWitness = await calculateWitnessValue(lowerTick, tokenXSymbol, tokenYSymbol);
        let upperTickWitness = await calculateWitnessValue(lowerTick, tokenXSymbol, tokenYSymbol);

        let optionSet = {
            lowerTickIndex: lowerTick,
            upperTickIndex: lowerTick,
            lowerTickWitness: lowerTickWitness,
            upperTickWitness: upperTickWitness,
            liquidity: liquidity,
            deadline: deadline,
            maximumTokensContributed: maximumTokensContributed,
        }
        // @ts-ignore
        let createPosition = PositionManager.setPositionOp(contractInstance, optionSet);

        if (
            TOKENS[tokenXSymbol].standard === TokenStandard.FA12 &&
            TOKENS[tokenYSymbol].standard === TokenStandard.FA2
          ) {
                 const op = await Tezos.wallet
                .batch([
                {
                    kind: OpKind.TRANSACTION,
                // @ts-ignore
                ...Approvals.approveFA12(contractAddress, amountTokenX.decimalPlaces(0, 1))
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
                    ...Approvals.approveFA12(contractAddress, amountTokenY.decimalPlaces(0, 1))
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
                    ...Approvals.approveFA12(contractAddress, amountTokenX.decimalPlaces(0, 1))
                },
                {
                    kind: OpKind.TRANSACTION,
                    // @ts-ignore
                    ...Approvals.approveFA12(contractAddress, amountTokenY.decimalPlaces(0, 1))
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

      }
      catch(error) {
          console.log("v3 error: ", error);
      }
}

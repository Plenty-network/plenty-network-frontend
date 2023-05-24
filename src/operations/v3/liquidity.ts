import { BalanceNat, } from '../types';
import BigNumber from 'bignumber.js';
import Config from "../../config/config";
import { PositionManager } from "@plenty-labs/v3-sdk";
import { calculateliquidity, calculateWitnessValue } from "../../api/v3/helper";
import { connectedNetwork, dappClient } from "../../common/walletconnect";

export const createPosition = async (amountTokenX: BigNumber, amountTokenY: BigNumber, lowerTick: number, upperTick: number, tokenXSymbol: String, tokenYSymbol: String, deadline: number, maximumTokensContributed: BalanceNat
    ): Promise<any>  => {
      try {
        const Tezos = await dappClient().tezos();
        const airdropContract: string = Config.AIRDROP[connectedNetwork];
        const airdropInstance = await Tezos.wallet.at(airdropContract);
        
        let amount = {
            x: amountTokenX,
            y: amountTokenY
        }
        let liquidity = await calculateliquidity(amount, lowerTick, upperTick, tokenXSymbol, tokenYSymbol )

        let lowerTickWitness = await calculateWitnessValue(lowerTick);
        let upperTickWitness = await calculateWitnessValue(lowerTick);

        let optionSet = {
            lowerTickIndex: lowerTick,
            upperTickIndex: lowerTick,
            lowerTickWitness: lowerTickWitness,
            upperTickWitness: upperTickWitness,
            liquidity: liquidity,
            deadline: deadline,
            maximumTokensContributed: maximumTokensContributed,
        }

        let createPosition = PositionManager.setPositionOp(airdropInstance, optionSet);

      }
      catch(error) {
          console.log("v3 error: ", error);
      }
}
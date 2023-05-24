import axios from 'axios';
import Config from '../../config/config';
import BigNumber from 'bignumber.js';
import { Token, BalanceNat, } from './types';
import { Tick, Liquidity, PositionManager } from "@plenty-labs/v3-sdk";
import { getDexAddress } from "../../api/util/fetchConfig";
import { dappClient } from "../../common/walletconnect";

const TokenDetail = async(tokenSymbol : String) : Promise<Token> => {
    let configResponse :any = await axios.get(Config.CONFIG_LINKS.testnet.TOKEN);
    configResponse = configResponse.data[`${tokenSymbol}`];

    let tokenAddress = configResponse.address;
    let tokenStandard = configResponse.standard;
    let tokenDecimals = configResponse.decimals;

    return {
        address: tokenAddress,
        standard: tokenStandard,
        decimals: tokenDecimals,
    }
}

export const ContractStorage = async(tokenXSymbol : string, tokenYSymbol : string) : Promise<any> => {
    let v3ContractAddress = getDexAddress(tokenXSymbol, tokenYSymbol);
    const v3ContractStorage = await axios.get(`${Config.RPC_NODES.testnet}/chains/main/blocks/head/context/contracts/${v3ContractAddress}/storage`);
    let sqrtPriceValue = BigNumber(parseInt(v3ContractStorage.data.args[3].int));
    let currTickIndex = parseInt(v3ContractStorage.data.args[0].args[0].args[1].int);
    let tickSpacing = parseInt(v3ContractStorage.data.args[0].args[0].args[0].args[0].args[4].int);
    
    let tokenX = await TokenDetail(tokenXSymbol);
    let tokenY = await TokenDetail(tokenYSymbol);
    
    return {
        sqrtPriceValue : sqrtPriceValue,
        currTickIndex : currTickIndex,
        tickSpacing : tickSpacing,
        tokenX : tokenX,
        tokenY : tokenY,
    };
}

export const calculateWitnessValue = async(witnessFrom : number, tokenXSymbol: string, tokenYSymbol: string) : Promise<any> => {
    let v3ContractAddress = getDexAddress(tokenXSymbol, tokenYSymbol);
    let rpcResponse :any = await axios.get(`${Config.RPC_NODES.testnet}/ticks?pool=${v3ContractAddress}&witnessOf=${witnessFrom}`);
    let witnessValue = rpcResponse.witness;

    return {
        witness: witnessValue
    }
}

export const calculateNearTickSpacing = async ( tick: number, space: number
    ): Promise<any>  => {
      try {
          let nearestTick = Tick.nearestUsableTick(tick, space);
        
          return nearestTick;
      }
      catch(error) {
          console.log("v3 error: ", error);
      }
}

export const nearestTickIndex = async ( 
    ): Promise<any>  => {
      try {
          let nearestTick = Tick;
        
          return nearestTick;
      }
      catch(error) {
          console.log("v3 error: ", error);
      }
}

export const calculateliquidity = async (amount: BalanceNat, lowerTick: number, upperTick: number, tokenXSymbol: string, tokenYSymbol: string 
    ): Promise<any>  => {
      try {
        let contractStorageParameters = await ContractStorage(tokenXSymbol, tokenYSymbol)
        let sqrtPriceFromLowerTick = Tick.computeSqrtPriceFromTick(lowerTick);
        let sqrtPriceFromUpperTick = Tick.computeSqrtPriceFromTick(upperTick);

        let liquidity = Liquidity.computeLiquidityFromAmount(amount, contractStorageParameters.sqrtPriceValue, sqrtPriceFromLowerTick, sqrtPriceFromUpperTick)   
        console.log('---v3----', liquidity);
    }
      catch(error) {
          console.log("v3 error: ", error);
      }
}

export const createPositionInstance = async (amountTokenX: BigNumber, amountTokenY: BigNumber, lowerTick: number, upperTick: number, tokenXSymbol: string, tokenYSymbol: string, deadline: number, maximumTokensContributed: BalanceNat
    ): Promise<any>  => {
      try {
        const Tezos = await dappClient().tezos();

        const contractAddress = getDexAddress(tokenXSymbol, tokenYSymbol);
        const contractInstance = await Tezos.wallet.at(contractAddress);
        
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

        return createPosition;
    }
      catch(error) {
          console.log("v3 error: ", error);
      }
}

import axios from 'axios';
import Config from '../../config/config';
import { Tick, Price, Pool } from "@plenty-labs/v3-sdk";
import BigNumber from 'bignumber.js';

const v3ContractAddress = `KT1M5yHd85ikngHm5YCu9gkfM2oqtbsKak8Y`;

export const calculatePrice = async (
  ): Promise<any>  => {
    try {
        const v3ContractStorage = await axios.get(`${Config.RPC_NODES.testnet}/chains/main/blocks/head/context/contracts/${v3ContractAddress}/storage`);
        let sqrtPriceValue = BigNumber(parseInt(v3ContractStorage.data.args[3].int));
        let currTickIndex = parseInt(v3ContractStorage.data.args[0].args[0].args[1].int);
        let tickSpacing = parseInt(v3ContractStorage.data.args[0].args[0].args[0].args[0].args[4].int);

        let realPricevalueBigNumber = Price.computeRealPriceFromSqrtPrice(sqrtPriceValue);
        let realPricevalue = realPricevalueBigNumber.multipliedBy(10 ** 12);
    
        let minTickPriceValue = Tick.computeRealPriceFromTick(2);
        let maxTickPriceValue = Tick.computeRealPriceFromTick(4);

        let PoolObject = new Pool(currTickIndex, tickSpacing, sqrtPriceValue);
        let amountXFromY = PoolObject.estimateAmountXFromY(0,0,0);

    }
    catch(error) {
        console.log("v3 error: ", error);
    }
}

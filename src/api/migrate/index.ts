import { store } from "../../redux";
import axios from "axios";
import { BigNumber } from "bignumber.js";
import { IMigrateExchange, IVestAndClaim, MigrateToken } from "./types";
import { veSwapAddress } from "../../common/walletconnect";
import { getTzktBigMapData, getTzktStorageData } from "../util/storageProvider";
import { DAY } from "../../constants/global";

export const getMigrateExchangeAmount = (inputValue : BigNumber , token : MigrateToken ) : IMigrateExchange => {
    try {

        let tokenOutAmount = new BigNumber(0);
        let exchangeRate = new BigNumber(0);
        if(token === MigrateToken.PLENTY){
            // Update Plenty exchange Rate
            exchangeRate = new BigNumber(3);
            tokenOutAmount = inputValue.multipliedBy(exchangeRate);
        }else{
            // Update Wrap exchange Rate
            exchangeRate = new BigNumber(2);
            tokenOutAmount = inputValue.multipliedBy(exchangeRate);
        }

        // 50% claimable and 50% vested
        const claimableAmount = tokenOutAmount.dividedBy(2);
        const vestedAmount = tokenOutAmount.dividedBy(2);

        return{
            success : true,
            claimableAmount,
            vestedAmount,
            exchangeRate
        };
        
    } catch (error) {
        console.log(error);
        return{
            success :false,
            claimableAmount : new BigNumber(0),
            vestedAmount :new BigNumber(0),
            exchangeRate : new BigNumber(0),
        };
    }
    
}

export const getUserClaimAndVestAmount =async (userAddress : string) : Promise<IVestAndClaim> => {

    try {

        const swapStorageResponse = await getTzktStorageData(veSwapAddress);
        const swapStorage = swapStorageResponse.data;
        const ledgerBigMap = swapStorage.ledger;

        const ledgerResponse = await getTzktBigMapData(ledgerBigMap , `key=${userAddress}&select=key,value`);
        const ledgerData = ledgerResponse.data.value;

        // Check division reqd or not
        const vested__ = BigNumber.min(ledgerData.balance , ledgerData.release_rate.multipliedBy(Date.now()/1000 - ledgerData.last_claim));

        const claimableAmount = vested__.plus(ledgerData.vested);
        const vestedAmount = new BigNumber(ledgerData.balance.minus(vested__));

        const isClaimable = (Date.now()/1000 - ledgerData.last_claim) > DAY ? true : false;

        return{
            success : true , 
            isClaimable,
            claimableAmount,
            vestedAmount
        };

        
    } catch (error) {
        console.log(error);
        return{
            success : false,
            isClaimable : false ,
            claimableAmount : new BigNumber(0),
            vestedAmount : new BigNumber(0)
        };
    }
    
}
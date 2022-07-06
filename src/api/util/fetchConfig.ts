import axios from 'axios';
import Config from '../../config/config';

// TODO : REMOVE EXPORTS AND USE REDUX

export let TOKEN: { [x: string]: any };
export let AMM: { [x: string]: any };

export const fetchConfig = async () => {
    const token_response = await axios.get(Config.TOKEN_CONFIG);
    const amms_response = await axios.get(Config.AMM_CONFIG);

    const tokens = token_response.data;
    const amms = amms_response.data;

    // localStorage.setItem(TOKEN_CONFIG, tokens);
    // localStorage.setItem(AMM_CONFIG ,amms);

    // for dev purpose only
    TOKEN = tokens;
    AMM = amms;
    return {
        TOKEN: TOKEN,
        AMM: AMM,
    };

    // Add to Redux / local storage
};


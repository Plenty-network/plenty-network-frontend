import axios from 'axios';
import Config from '../../config/config';

export const fetchConfig = async () => {
    const token_response = await axios.get(Config.TOKEN_CONFIG);
    const amms_response = await axios.get(Config.AMM_CONFIG);

    const TOKEN :{ [x: string]: any } = token_response.data;
    const AMM : { [x: string]: any }  = amms_response.data;
    return {
        TOKEN: TOKEN,
        AMM: AMM,
    };
};


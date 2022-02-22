import Blowfish from "egoroof-blowfish";
import fetch from 'node-fetch';
import { url, BLOWFISH_SECRET_KEY } from "../constant";

const blowFish = new Blowfish(BLOWFISH_SECRET_KEY);

export const publishResult = (result) => {
    let payload = blowFish.encode(JSON.stringify(result));
    console.log("payload in publish-->>",payload);
    fetch(url.publishResultUrl, {
        method: 'post',
        body: payload,
        headers: {'Content-Type': 'text/plain'}
    })
    .then(response => {
        console.log("Response-->",response);
    })
    .catch(error => {
        console.log(error);
    })
};

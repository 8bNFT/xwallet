import { writable } from 'svelte/store';
import { Link } from '@imtbl/imx-sdk';

export const createLink = function(network){
    const { subscribe } = writable(new Link(`https://link${network === "testnet" ? ".ropsten." : "."}x.immutable.com`))
    return { subscribe }
}
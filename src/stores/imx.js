import { writable } from 'svelte/store';
import { Link } from '@imtbl/imx-sdk';
import { getLinkURL } from 'src/util/imx';

export const createLink = function(network){
    const { subscribe } = writable(new Link(getLinkURL(network)))
    return { subscribe }
}
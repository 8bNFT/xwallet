import { parseWithDecimals } from 'src/util/cfx.js';
import { readable, writable } from 'svelte/store';
import { createLink } from './imx.js';
import { API } from 'src/util/imx.js';
import { WalletManager } from 'src/wallets/wallet_manager.js';
import { ImmutableX, Config } from '@imtbl/core-sdk';
import { FlowStore } from './generics.js';

const TOKEN_PRICE_API = "https://tools.immutable.com/token-api/tokens/"

const createUserStore = async () => {
    let current = false
    const { subscribe, set: _set } = writable(current);

    const cleanup = () => {
        FlowStore.reset()
    }

    const set = v => {
        if(v === false) cleanup()
        if(v) console.log(v.starkPublicKey)
        current = v
        _set(current)
    }

    const disconnect = () => current?.wallet?.disconnect()

    return {
        set,
        subscribe,
        disconnect
    }
}

const fetchTokens = async network => {
    const result = await fetch(TOKEN_PRICE_API + network)
    return await result.json()
}

const createBalanceStore = async (network, token_info, userStore) => {
    return readable({}, function start(set) {
        let interval = false
        let address

        const fetchBalance = async()=>{
            const balances = await fetch(API(network) + '/v2/balances/' + address)
    
            try{
                const { result } = await balances.json()
                const state = {}
                for(let token of result){
                    let { token_address, ...balances } = token
                    token_address ||= "ETH"
                    const id = token_address
                    if(!token_info[id]) continue
    
                    for(let key of Object.keys(balances)){
                        if(!["balance", "preparing_withdrawal", "withdrawable"].includes(key)) continue
                        balances[key] = {
                            raw: balances[key],
                            parsed: balances[key] ? parseWithDecimals(balances[key], token_info[id].decimals, token_info[id].precision) : 0
                        }
                    }
                    state[id] = {...balances, ...token_info[id]}
                }
    
                set(state)
            }catch(err){
                console.error('[WALLET]', err)
            }
        }
    
        const unsubscribe = userStore.subscribe(user =>{
            clearInterval(interval)
            set(false)
    
            if(!user.address) return 
            address = user.address

            fetchBalance()
            interval = setInterval(async ()=>fetchBalance(), 10 * 1000)
        })
    
        return function stop() {
            unsubscribe()
            if(interval) clearInterval(interval)
            set(false)
        };
    })
}

const initializeWalletStore = async network => {
    const LinkStore = createLink(network)
    const tokenInformation = await fetchTokens(network)
    const UserStore = await createUserStore(network, LinkStore)
    const BalanceInformation = await createBalanceStore(network, tokenInformation, UserStore)

    Link = LinkStore
    Balances = BalanceInformation
    User = UserStore
    tokens = tokenInformation
    walletManager = new WalletManager(network, User)

    await walletManager.checkExistingSession()

    return {
        User: UserStore,
        Link: LinkStore,
        tokens: tokenInformation,
        Balances: BalanceInformation
    }
}

export function createWalletStore(){
    const { subscribe, set } = writable(false)

    let network
    const initialize = async _network => {
        set(await initializeWalletStore(_network))
        network = _network
        return true
    }

    return {
        subscribe, 
        initialize,
        isInitialized: () => typeof network !== "undefined",
        getNetwork: _ => network
    }
}

export let Link
export let Balances
export let User
export let tokens
export let walletManager
export const Wallet = createWalletStore()
export const getCoreSDK = () =>new ImmutableX(Wallet.getNetwork() === "mainnet" ? Config.PRODUCTION : Config.SANDBOX)
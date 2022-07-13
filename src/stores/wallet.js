import { readable, writable, get } from 'svelte/store';
import { createLink } from './imx.js';
import BN from 'bignumber.js';

const API = network => `https://api${network === "testnet" && ".ropsten." || "."}x.immutable.com`

const createUserStore = async (network, Link) => {
    const { subscribe, set, update } = writable(false);

    function checkSession(){
        const cached = localStorage.getItem('wallet_' + network)
        if(!cached) return false

        const info = JSON.parse(cached)
        update(v => v.address && v.network === network ? v : info)
        return info
    }

    async function login(){
        try{
            const { address, starkPublicKey } = await get(Link).setup({})
            set({address, starkPublicKey, network})
            localStorage.setItem('wallet_' + network, JSON.stringify({address, starkPublicKey, network}))
            return { address, starkPublicKey, network }
        }catch(err){
            console.error(err)
            return false
        }
    }

    function logout(){
        localStorage.removeItem('wallet_' + network)
        set(false)
    }

    checkSession()

    return {
        subscribe,
        login,
        logout
    }
}

const fetchTokens = async network => {
    const result = await fetch('http://localhost:3000/tokens/' + network)
    return await result.json()
}

const createBalanceStore = async (network, token_info, userStore) => {
    return readable(false, function start(set) {
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
                            parsed: balances[key] ? ((new BN(balances[key])).times(new BN(Math.pow(10, parseInt('-' + token_info[id].decimals))))).toString(10) : 0
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
    const Link = createLink(network)
    const tokenInformation = await fetchTokens(network)
    const UserStore = await createUserStore(network, Link)
    const Balances = await createBalanceStore(network, tokenInformation, UserStore)

    return {
        User: UserStore,
        Link,
        tokens: tokenInformation,
        Balances
    }
}

export function createWalletStore(){
    const { subscribe, set } = writable(false)

    let init = false
    const initialize = async network => {
        if(init) return true
        set(await initializeWalletStore(network))
        init = true
        return true
    }

    return {
        subscribe, 
        initialize
    }
}

export const Wallet = createWalletStore()
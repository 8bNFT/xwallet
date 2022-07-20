import { parseWithDecimals } from 'src/util/cfx.js';
import { readable, writable, get } from 'svelte/store';
import { createLink } from './imx.js';
import { API } from 'src/util/imx.js';

const TOKEN_PRICE_API = "https://tools.immutable.com/token-api/tokens/"

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
            const { address, starkPublicKey } = await get(Link).setup({ providerPreference: "none" })
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
    const result = await fetch(TOKEN_PRICE_API + network)
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
export const Wallet = createWalletStore()
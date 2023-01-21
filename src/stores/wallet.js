import { parseWithDecimals } from 'src/util/cfx.js';
import { get, readable, writable } from 'svelte/store';
import { API } from 'src/util/imx.js';
import { WalletManager } from 'src/wallets/wallet_manager.js';
import { createGenericStore, FlowStore } from './generics.js';

const TOKEN_PRICE_API = "https://tools.immutable.com/token-api/tokens/"

const createUserStore = () => {
    let current = false
    const { subscribe, set: _set } = writable(current);

    const cleanup = () => {
        FlowStore.reset()
    }

    const set = v => {
        if(v === false) cleanup()
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

const fetchBalances = async (network, userStore, tokenStore) => {
    if(!network) return {}

    const { address } = (get(userStore) || {})
    if(!address) return {}

    const token_info = get(tokenStore)
    if(!Object.keys(token_info).length) return {}

    try{
        const { result } = await (await fetch(`${API(network)}/v2/balances/${address}`)).json()
        const state = {}
        for(const { token_address, ...balances } of result){
            const id = token_address || "ETH"
            if(!(id in token_info)) continue

            for(const [balance_type, balance] of Object.entries(balances)){
                if(!["balance", "preparing_withdrawal", "withdrawable"].includes(balance_type)) continue

                balances[balance_type] = {
                    raw: balance,
                    parsed: balance ? parseWithDecimals(balance, token_info[id].decimals, token_info[id].precision) : 0
                }
                state[id] = { ...balances, ...token_info[id] }
            }
        }

        return state
    }catch(err){
        console.error("[BALANCE]", err)
    }

    return {}
}

const createBalanceStore = (network, userStore, tokenStore) => {
    const { subscribe } = readable(false, function start(set) {
        let interval = false

        const fetchBalance = async () => set(await fetchBalances(network, userStore, tokenStore))

        const unsubscribe = userStore.subscribe(user => {
            clearInterval(interval)
            set(false)
    
            if(!user.address) return 

            fetchBalance()
            interval = setInterval(() => fetchBalance(), 10 * 1000)
        })
    
        return function stop() {
            unsubscribe()
            if(interval) clearInterval(interval)
            set(false)
        };
    })

    return {
        subscribe
    }
}

const initializeWalletStore = async network => {
    const tokenStore = createGenericStore(await fetchTokens(network))
    const userStore = createUserStore()
    const balanceStore = createBalanceStore(network, userStore, tokenStore)
    const walletManager = new WalletManager(network, userStore)

    await walletManager.checkExistingSession()

    return {
        User: userStore,
        Tokens: tokenStore,
        Balances: balanceStore,
        Manager: createGenericStore(walletManager)
    }
}

export function createWalletStore(){
    const { subscribe, set } = writable({
        User: createGenericStore(false),
        Tokens: createGenericStore({}),
        Balances: createGenericStore(false),
        Manager: createGenericStore({})
    })

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
        getNetwork: () => network
    }
}

export const Wallet = createWalletStore()
export const getFromWallet = prop => get(get(Wallet)[prop])
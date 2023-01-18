export const LOCAL_STORAGE_IDENTIFIER = network => `__wallet_${network}`
export const STARK_KEY_MAPPING = "__stark_key_mapping"

export const getLastUsedWallet = network => {
    const cache = localStorage.getItem(LOCAL_STORAGE_IDENTIFIER(network))
    if(!cache) return {}

    try{
        return JSON.parse(cache)
    }catch{
        return {}
    }
}

export const setLastUsedWallet = (network, wallet) => localStorage.setItem(LOCAL_STORAGE_IDENTIFIER(network), JSON.stringify(wallet))

const getCachedStarkPrivateKeys = () => {
    const cache = localStorage.getItem(STARK_KEY_MAPPING)
    if(!cache) return {}

    try{
        return JSON.parse(cache)
    }catch{
        return {}
    }
}

export const getCachedStarkPrivateKey = address => {
    const keys = getCachedStarkPrivateKeys()
    return keys[address.toLowerCase()] || false
}

export const addCachedStarkPrivateKey = (address, privateKey) => {
    const keys = getCachedStarkPrivateKeys()
    keys[address.toLowerCase()] = privateKey
    localStorage.setItem(STARK_KEY_MAPPING, JSON.stringify(keys))
}
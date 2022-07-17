export const getLinkURL = network => network === "testnet" ? "https://link.ropsten.x.immutable.com" : "https://link.x.immutable.com"

export const getAPIURL = network => network === "testnet" ? "https://api.ropsten.x.immutable.com" : "https://api.x.immutable.com" 

export const API = (network, path = "") => getAPIURL(network) + path

export const ONRAMP_TOKENS = {
    mainnet: ["ETH", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"],
    testnet: ["ETH", "0x07865c6e87b9f70255377e024ace6630c1eaa37f"]
}

const filterTokens = (tokens, validTokens) => {
    if(Array.isArray(tokens)) return tokens.filter(v => validTokens.includes(v.id))
    if(typeof tokens === "object"){
        const filtered = Object.entries(tokens).filter(([k, v]) => validTokens.includes(v.id))
        return Object.fromEntries(filtered)
    }

    return null
}

export const filterOnrampTokens = (tokens, network) => filterTokens(tokens, ONRAMP_TOKENS[network])

export const OFFRAMP_TOKENS = {
    mainnet: ["ETH"],
    testnet: ["ETH"]
}

export const filterOfframpTokens = (tokens, network) => filterTokens(tokens, OFFRAMP_TOKENS[network])
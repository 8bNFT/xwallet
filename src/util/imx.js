import { parseWithDecimals } from "./cfx"
import { get } from "svelte/store"

export const getLinkURL = network => network === "testnet" ? "https://link.sandbox.x.immutable.com" : "https://link.x.immutable.com"

export const getAPIURL = network => network === "testnet" ? "https://api.sandbox.x.immutable.com" : "https://api.x.immutable.com" 

export const API = (network, path = "") => getAPIURL(network) + path

export const ONRAMP_TOKENS = {
    mainnet: ["ETH", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"],
    testnet: ["ETH"]
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


const eventHistory = {}

const transformBridging = (bridge, from = false) => {
    const temp = []
    for(let { user, sender, timestamp, token, transaction_id } of bridge){
        if(!["ETH", "ERC20"].includes(token.type)) continue

        temp.push({
            event: from ? "withdrawal" : "deposit",
            transaction_id,
            token: token.type === "ETH" && "ETH" || token.data.token_address,
            amount: parseWithDecimals(`${from && '-' || ''}${token.data.quantity}`, token.data.decimals),
            from: user || sender,
            to: user || sender,
            timestamp: new Date(timestamp)
        })
    }

    return temp
}

const fetchWithCache = async (url, ...config) => {
    if(eventHistory[url] && eventHistory[url].expires > Date.now()) return eventHistory[url].data
    const response = await fetch(url, config)
    const json = await response.json()
    eventHistory[url] = { expires: Date.now() + (15 * 60 * 1000), data: json }
    return json
}

export const getDeposits = async (user, network) => {
    const { result } = await fetchWithCache(API(network, `/v1/deposits?page_size=200&user=${user}`))
    return transformBridging(result)
}

export const getWithdrawals = async (user, network) => {
    const { result } = await fetchWithCache(API(network, `/v1/withdrawals?page_size=200&withdrawn_to_wallet=true&user=${user}`))
    return transformBridging(result, true)
}

const transformTransfers = (transfers, from = false) => {
    const temp = []

    for(let { user, receiver, timestamp, token, transaction_id } of transfers){
        if(!["ETH", "ERC20"].includes(token.type)) continue

        temp.push({
            transaction_id,
            event: from ? "transfer_out" : "transfer_in",
            token: token.type === "ETH" && "ETH" || token.data.token_address,
            amount: parseWithDecimals(`${from && '-' || ''}${token.data.quantity}`, token.data.decimals),
            from: user,
            to: receiver,
            timestamp: new Date(timestamp)
        })
    }

    return temp
}

export const getTransfersFrom = async (user, network) => {
    const { result } = await fetchWithCache(API(network, `/v1/transfers?page_size=200&status=success&user=${user}`))
    return transformTransfers(result, true)
}

export const getTransfersTo = async (user, network) => {
    const { result } = await fetchWithCache(API(network, `/v1/transfers?page_size=200&status=success&receiver=${user}`))
    return transformTransfers(result)
}

const transformOrders = (orders) => {
    const temp = []

    for(let { user, updated_timestamp: timestamp, order_id: transaction_id, sell, buy } of orders){
        if(sell.type === buy.type) continue

        let collection, from, token, seller, buyer, token_id

        if(sell.type === "ERC721"){
            collection = sell.data.properties.collection.name
            token_id = sell.data.token_id
            from = false
            token = buy
            seller = user
        } else if(["ETH", "ERC20"].includes(sell.type)) {
            if(["ETH", "ERC20"].includes(buy.type)) continue
            collection = buy.data.properties.collection.name
            token_id = buy.data.token_id
            from = true
            token = sell
            buyer = user
        } else {
            continue
        }

        temp.push({
            transaction_id,
            event: from ? "purchase" : "sale",
            token: token.type === "ETH" && "ETH" || token.data.token_address,
            amount: parseWithDecimals(`${from && '-' || ''}${token.data.quantity}`, token.data.decimals),
            from: buyer,
            to: seller,
            collection,
            token_id,
            timestamp: new Date(timestamp)
        })
    }

    return temp
}

const getOrders = async(user, network) => {
    const { result } = await fetchWithCache(API(network, `/v1/orders?page_size=200&user=${user}&status=filled`))
    return transformOrders(result)
}

export const getEventHistory = async (user, network) => {
    const key = `${user}_${network}`
    if(eventHistory[key] && eventHistory[key].expires > Date.now()) return eventHistory[key].data

    const promises = [getTransfersTo(user, network), getTransfersFrom(user, network), getWithdrawals(user, network), getDeposits(user, network), getOrders(user, network)]
    const settled = await Promise.allSettled(promises)
    const success = settled.filter(v => v.status === "fulfilled")
    const merged = success.reduce((acc, { value }) => [...acc, ...value], []).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    eventHistory[key] = { data: merged, expires: Date.now() + (15 * 60 * 1000)}

    return merged
}

export const getEventHistoryProgressive = async (user, network, list, signal) => {
    const wrapPromise = async request => {
        try{
            const result = await request
            list.set([...get(list), ...result])
            return result
        }catch(err){
            console.log(err)
            return []
        }
    }

    await Promise.allSettled([
        wrapPromise(getTransfersTo(user, network)),
        wrapPromise(getTransfersFrom(user, network)),
        wrapPromise(getWithdrawals(user, network)),
        wrapPromise(getDeposits(user, network)),
        wrapPromise(getOrders(user, network))
    ])

    signal.set(true)
}
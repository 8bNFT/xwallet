import Web3 from "web3"
import { Wallet } from "src/stores/wallet"
import { parseWithDecimals } from "./cfx"

const RPC_ENDPOINTS = {
    testnet: "https://eth-ropsten.alchemyapi.io/v2/l8_rK0oy2uLAVLZwUVBimAc4qwcBTU2z",
    mainnet: "https://eth-mainnet.alchemyapi.io/v2/l8_rK0oy2uLAVLZwUVBimAc4qwcBTU2z"
}

const CONTRACT_ABI = {
    ERC20: [
        {
            "constant":true,
            "inputs":[{"name":"account","type":"address"}],
            "name":"balanceOf",
            "outputs":[{"name":"balance","type":"uint256"}],
            "type":"function"
        }
    ]
}

const balanceCache = {}

export const buildWeb3 = network => {
    network = network || Wallet.getNetwork()
    if(!network) throw "No network specified (mainnet|testnet)"

    return new Web3(RPC_ENDPOINTS[network])
}

const getBalanceCacheKey = ({ wallet, token, network }) => `${wallet.toLowerCase()}|${token && token.id + "|" || ""}${network}`

const getBalanceCache = ({ wallet, token, network }) => {
    const key = getBalanceCacheKey({ wallet, token, network })
    const cache = balanceCache[key]
    if(cache && cache.expires > Date.now()) return cache.data
    return false
}

const setBalanceCache = ({ wallet, token, network, data, expires = 60}) => {
    const key = getBalanceCacheKey({ wallet, token, network })
    balanceCache[key] = { data, expires: Date.now() + (expires * 1000)}
    return data
}

export const getERC20Balance = async ({ wallet, token, network }) => {
    const cache = getBalanceCache({ wallet, token, network })
    if(cache) return cache

    const web3 = buildWeb3(network)
    const ABI = CONTRACT_ABI.ERC20
    const contract = new web3.eth.Contract(ABI, token.token_address)

    const balance = await contract.methods.balanceOf(wallet).call()
    const parsedBalance = parseWithDecimals(balance, token.decimals, token.precision)

    return setBalanceCache({ data: parsedBalance, wallet, token, network })
}

export const getETHBalance = async ({ wallet, network }) => {
    const cache = getBalanceCache({ wallet, network })
    if(cache) return cache

    const web3 = buildWeb3(network)
    const balance = await web3.eth.getBalance(wallet)
    const parsedBalance = parseWithDecimals(balance, 18, 10)
    
    return setBalanceCache({ wallet, network, data: parsedBalance })
}

export const getTokenBalance = ({ wallet, token, network }) => {
    if(token.id === "ETH") return getETHBalance({ wallet, network })
    return getERC20Balance({ wallet, token, network })
}
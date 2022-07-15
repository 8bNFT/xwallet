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

export const buildWeb3 = network => {
    network = network || Wallet.getNetwork()
    if(!network) throw "No network specified (mainnet|testnet)"

    return new Web3(RPC_ENDPOINTS[network])
}

export const getERC20Balance = async ({ wallet, token, network }) => {
    const web3 = buildWeb3(network)
    const ABI = CONTRACT_ABI.ERC20

    const contract = new web3.eth.Contract(ABI, token.token_address)
    const balance = await contract.methods.balanceOf(wallet).call()
    return parseWithDecimals(balance, token.decimals, token.precision)
}

export const getETHBalance = async ({ wallet, network }) => {
    const web3 = buildWeb3(network)
    const balance = await web3.eth.getBalance(wallet)
    return parseWithDecimals(balance, 18, 10)
}

export const getTokenBalance = ({ wallet, token, network }) => {
    if(token.id === "ETH") return getETHBalance({ wallet, network })
    return getERC20Balance({ wallet, token, network })
}
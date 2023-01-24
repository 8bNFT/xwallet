import { assetToUSD, parsedToRaw } from "src/util/cfx"
import { getFromWallet, Wallet } from "src/stores/wallet"
import { extractError, sliceAddress } from "src/util/generic"
import { getCoreSDK, NETWORKS } from "src/util/imx"

const extractDepositPayload = (payload, token) => {
    if(token.id === "ETH"){
        return {
                type: "ETH",
                amount: payload.amount.wei,
                amount_parsed: payload.amount.parsed,
        }
    }

    return {
            type: "ERC20",
            tokenAddress: token.token_address,
            symbol: token.symbol,
            amount: payload.amount.wei,
            amount_parsed: payload.amount.parsed,
    }
}

const buildDepositSuccess = ({ amount, amount_usd, symbol, hash }) => {
    const message = `You successfully deposited <span>${amount} ${symbol} ($${amount_usd})</span> to your Immutable X account.<br>It may take up to 10 minutes before your balance updates.`
    if(!hash) return message

    const etherscan = Wallet.getNetwork() === NETWORKS.MAINNET ? "https://etherscan.io/tx/" : "https://goerli.etherscan.io/tx/"
    return message + `<br><br>Transaction: <a target="_blank" href="${etherscan + hash}">${sliceAddress(hash)}</a>`
}

const parseDepositResult = (result, token) => {
    const { amount, symbol } = result

    return {
        hash: result.hash,
        amount: amount.parsed,
        amount_usd: assetToUSD(amount.parsed, token.price),
        symbol: symbol || token.symbol || "ETH",
    }
}

export const handleDepositCall = async ({ payload: { coin, amount } }) => {
    const token = getFromWallet("Tokens")[coin]
    const payload = { coin, amount: { parsed: amount, wei: parsedToRaw(amount, token.decimals) }, token }
    const { wallet, walletConnection } = getFromWallet("User")
    const depositPayload = extractDepositPayload(payload, token)
    const sdk = walletConnection ? getCoreSDK() : wallet
    const args = walletConnection ? [walletConnection.ethSigner, depositPayload] : [depositPayload]

    try{
        const result = await sdk.deposit(...args)
        const parsedResult = parseDepositResult({ ...payload, hash: result?.hash }, token)
        const message = buildDepositSuccess(parsedResult)

        return {
            result: parsedResult,
            message
        }
    }catch(err){
        return {
            error: extractError(err)
        }
    }
}
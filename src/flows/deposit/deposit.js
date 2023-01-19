import { assetToUSD, parsedToRaw } from "src/util/cfx"
import { User, tokens, getCoreSDK } from "src/stores/wallet"
import { get } from "svelte/store"

const extractDepositPayload = (payload, token, core = true) => {
    if(token.id === "ETH"){
        return {
                type: "ETH",
                amount: core ? payload.amount.wei : payload.amount.parsed,
        }
    }

    return {
            type: "ERC20",
            tokenAddress: token.token_address,
            symbol: token.symbol,
            amount: core ? payload.amount.wei : payload.amount.parsed
    }
}

const buildDepositSuccess = ({ amount, amount_usd, symbol, hash }) => {
    return `You successfully deposited <span>${amount} ${symbol} ($${amount_usd})</span> to your Immutable X account.${hash ? `\n${hash}` : ""}`
}

const parseDepositResult = (result, token) => {
    const { amount, symbol } = result

    return {
        hash: result.hash,
        amount,
        amount_usd: assetToUSD(amount, token.price),
        symbol: symbol || token.symbol || "ETH",
    }
}

export const handleDepositCall = async ({ payload: { coin, amount } }) => {
    const token = tokens[coin]
    const amount_in_wei = parsedToRaw(amount, token.decimals)
    const payload = { coin, amount: { parsed: amount, wei: amount_in_wei }, token }
    const { wallet, walletConnection } = get(User)

    try{
        const depositPayload = extractDepositPayload(payload, token, typeof walletConnection !== "undefined")
        const result = walletConnection ? getCoreSDK().deposit(walletConnection.ethSigner, depositPayload) : await wallet.deposit(depositPayload)
        const parsedResult = parseDepositResult({ ...payload, hash: result?.hash }, token)
        const message = buildDepositSuccess(parsedResult)

        return {
            result: parsedResult,
            message
        }
    }catch(err){
        console.log(err)
        const error = err && (typeof err === "string" ? err : err.message) || "Unknown error or action denied."
        return {
            error
        }
    }
}
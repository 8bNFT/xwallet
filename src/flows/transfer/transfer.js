import { getCoreSDK, User, tokens } from "src/stores/wallet"
import { assetToUSD, parsedToRaw } from "src/util/cfx"
import { sliceAddress } from "src/util/generic"
import { get } from "svelte/store"

const extractTransferPayload = (payload, token, core = true) => {
    if(token.id === "ETH"){
        return {
            type: "ETH",
            amount: core ? payload.amount.wei : payload.amount.parsed,
            [core ? "receiver" : "toAddress"]: payload.receiver
        }
    }

    return {
        type: "ERC20",
        tokenAddress: token.token_address,
        symbol: token.symbol,
        amount: core ? payload.amount.wei : payload.amount.parsed,
        [core ? "receiver" : "toAddress"]: payload.receiver
    }
}

const buildTransferSuccess = ({ amount, amount_usd, symbol, receiver}) => {
    return `You successfully sent <span>${amount} ${symbol} ($${amount_usd})</span> to <span>${sliceAddress(receiver, 8)}</span>.`
}

const parseTransferResult = (result, token) => {
    const amount = result.amount?.parsed || result.amount
    const receiver = result.receiver || result.toAddress
    const transaction_id = result.transfer_id || result.txId

    return {
        amount: amount,
        amount_usd: assetToUSD(amount, token.price),
        symbol: result.symbol || token.symbol || "ETH",
        receiver,
        transaction_id
    }
}

export const handleTransferCall = async ({ payload: { coin, amount, receiver } }) => {
    const token = tokens[coin]
    const payload = { coin, amount: { parsed: amount, wei: parsedToRaw(amount, token.decimals) }, receiver }
    const { wallet, walletConnection } = get(User)
    const transferPayload = extractTransferPayload(payload, token, typeof walletConnection !== "undefined")

    try{
        const result = walletConnection ? await getCoreSDK().transfer(walletConnection, transferPayload) : await wallet.transfer([transferPayload])
        if(!result || (!walletConnection && !result?.result.length)) throw "Error occurred while trying to process your transfer"

        const transferResult = walletConnection ? result : result[0]
        if(transferResult.status === "error"){
            throw transferResult.message || "Error occurred while trying to process your transfer"
        }

        const parsedResult = parseTransferResult({...payload, ...transferResult}, token)
        const message = buildTransferSuccess(parsedResult)

        return {
            result: parsedResult,
            message
        }
    }catch(err){
        const error = err && (typeof err === "string" ? err : err.message) || "Unknown error or action denied."
        return {
            error
        }
    }
}
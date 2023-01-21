import { getFromWallet } from "src/stores/wallet"
import { getCoreSDK } from "src/util/imx"
import { assetToUSD, parsedToRaw } from "src/util/cfx"
import { sliceAddress } from "src/util/generic"

const extractTransferPayload = (payload, token) => {
    if(token.id === "ETH"){
        return {
            type: "ETH",
            amount: payload.amount.wei,
            amount_parsed: payload.amount.parsed,
            receiver: payload.receiver
        }
    }

    return {
        type: "ERC20",
        tokenAddress: token.token_address,
        symbol: token.symbol,
        amount: payload.amount.wei,
        amount_parsed: payload.amount.parsed,
        receiver: payload.receiver
    }
}

const buildTransferSuccess = ({ amount, amount_usd, symbol, receiver}) => {
    return `You successfully sent <span>${amount} ${symbol} ($${amount_usd})</span> to <span>${sliceAddress(receiver, 8)}</span>.`
}

const parseTransferResult = (result, token) => {
    const amount = result.amount?.parsed || result.amount

    return {
        amount: amount,
        amount_usd: assetToUSD(amount, token.price),
        symbol: result.symbol || token.symbol || "ETH",
        receiver: result.receiver,
        transaction_id: result.transfer_id
    }
}

export const handleTransferCall = async ({ payload: { coin, amount, receiver } }) => {
    const token = getFromWallet("Tokens")[coin]
    const payload = { coin, amount: { parsed: amount, wei: parsedToRaw(amount, token.decimals) }, receiver }
    const { wallet, walletConnection } = getFromWallet("User")
    const transferPayload = extractTransferPayload(payload, token)
    const args = walletConnection ? [walletConnection, transferPayload] : [transferPayload]
    const sdk = walletConnection ? getCoreSDK() : wallet

    try{
        const result = await sdk.transfer(...args)
        if(!result) throw "Error occurred while trying to process your transfer"
        if(result.status === "error") throw result.message || "Error occurred while trying to process your transfer"

        const parsedResult = parseTransferResult({...payload, ...result}, token)
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
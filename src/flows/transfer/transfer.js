import { assetToUSD } from "src/util/cfx"
import { sliceAddress } from "src/util/generic"

const extractTransferPayload = (payload, token) => {
    if(token.id === "ETH"){
        return [
            {
                type: "ETH",
                amount: payload.amount,
                toAddress: payload.receiver
            }
        ]
    }

    return [
        {
            type: "ERC20",
            tokenAddress: token.token_address,
            symbol: token.symbol,
            amount: payload.amount,
            toAddress: payload.receiver
        }
    ]
}

const buildTransferSuccess = ({ amount, amount_usd, symbol, receiver}) => {
    return `You successfully sent <span>${amount} ${symbol} ($${amount_usd})</span> to <span>${sliceAddress(receiver, 8)}</span>.`
}

const parseTransferResult = (result, token) => {
    const { amount, symbol, toAddress: receiver, txId: transaction_id } = result

    return {
        amount,
        amount_usd: assetToUSD(amount, token.price),
        symbol: symbol || token.symbol || "ETH",
        receiver,
        transaction_id
    }
}

export const handleTransferCall = async ({link: Link, payload, tokens}) => {
    const payloadCopy = {...payload}
    const token = tokens[payloadCopy.coin]

    try{
        const { result } = await Link.transfer(extractTransferPayload(payloadCopy, token))
        if(!result || !result.length) throw "Error occurred while trying to process your transfer"

        const transferResult = result[0]
        if(transferResult.status === "error"){
            throw transferResult.message || "Error occurred while trying to process your transfer"
        }

        const parsedResult = parseTransferResult(transferResult, token)
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
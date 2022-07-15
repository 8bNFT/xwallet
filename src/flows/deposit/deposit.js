import { assetToUSD } from "src/util/cfx"

const extractDepositPayload = (payload, token) => {
    if(token.id === "ETH"){
        return {
                type: "ETH",
                amount: payload.amount,
            }
    }

    return {
            type: "ERC20",
            tokenAddress: token.token_address,
            symbol: token.symbol,
            amount: payload.amount
        }
}

const buildDepositSuccess = ({ amount, amount_usd, symbol }) => {
    return `You successfully deposited <span>${amount} ${symbol} ($${amount_usd})</span> to your Immutable X account.`
}

const parseDepositResult = (result, token) => {
    const { amount, symbol } = result

    return {
        amount,
        amount_usd: assetToUSD(amount, token.price),
        symbol: symbol || token.symbol || "ETH",
    }
}

export const handleDepositCall = async ({link: Link, payload, tokens}) => {
    const payloadCopy = {...payload}
    const token = tokens[payloadCopy.coin]

    try{
        await Link.deposit(extractDepositPayload(payloadCopy, token))
        const parsedResult = parseDepositResult(payloadCopy, token)
        const message = buildDepositSuccess(parsedResult)

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
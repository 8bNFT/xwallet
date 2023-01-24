import { getFromWallet } from "src/stores/wallet"
import { extractError } from "src/util/generic"

const extractOfframpPayload = (payload, token) => {
    return { cryptoCurrencies: [token.symbol], amount: payload.amount }
}

const buildOfframpSuccess = ({ symbol, exchange_id }) => {
    return `You successfully sold <span>${symbol}</span> from your Immutable X account.<br/>Exchange ID: ${exchange_id}`
}

const parseOfframpResult = (result, token) => {
    const { symbol } = token
    const { exchangeId: exchange_id } = result

    return {
        amount,
        exchange_id,
        symbol
    }
}

export const handleOfframpCall = async ({ payload }) => {
    const payloadCopy = {...payload}
    const token = getFromWallet("Tokens")[payloadCopy.coin]

    try{
        const result = await getFromWallet("User").wallet.cryptoToFiat(extractOfframpPayload(payloadCopy, token))
        const parsedResult = parseOfframpResult(result, token)
        const message = buildOfframpSuccess(parsedResult)

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
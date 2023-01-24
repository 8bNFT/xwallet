// fiatToCrypto: (params: {
//     cryptoCurrencies?: string[] | undefined;
// }) => Promise<{
//     exchangeId: string;
// }>;
// cryptoToFiat: (params: {
//     cryptoCurrencies?: string[] | undefined;
//     amount?: string | undefined;
// }) => Promise<{
//     exchangeId: string;
// }>;

import { getFromWallet } from "src/stores/wallet"
import { extractError } from "src/util/generic"

const extractOnrampPayload = (payload, token) => {
    return { cryptoCurrencies: [token.symbol] }
}

const buildOnrampSuccess = ({ symbol, exchange_id }) => {
    return `You successfully added <span>${symbol}</span> to your Immutable X account.<br/>Exchange ID: ${exchange_id}`
}

const parseOnrampResult = (result, token) => {
    const { symbol } = token
    const { exchangeId: exchange_id } = result

    return {
        amount,
        exchange_id,
        symbol
    }
}

export const handleOnrampCall = async ({ payload }) => {
    const payloadCopy = {...payload}
    const token = getFromWallet("Tokens")[payloadCopy.coin]

    try{
        const result = await getFromWallet("User").wallet.fiatToCrypto(extractOnrampPayload(payloadCopy, token))
        const parsedResult = parseOnrampResult(result, token)
        const message = buildOnrampSuccess(parsedResult)

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
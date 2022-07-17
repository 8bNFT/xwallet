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

export const handleOnrampCall = async ({link: Link, payload, tokens}) => {
    const payloadCopy = {...payload}
    const token = tokens[payloadCopy.coin]

    try{
        const result = await Link.fiatToCrypto(extractOnrampPayload(payloadCopy, token))
        const parsedResult = parseOnrampResult(result, token)
        const message = buildOnrampSuccess(parsedResult)

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
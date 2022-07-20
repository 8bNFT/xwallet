import { assetToUSD } from "src/util/cfx"
import { Wallet } from "src/stores/wallet"
import { sliceAddress } from "src/util/generic"

const extractWithdrawalPayload = (payload, token, preparing = false) => {
    if(token.id === "ETH"){
        return {
                type: "ETH",
                amount: preparing ? payload.amount : undefined,
            }
    }

    return {
            type: "ERC20",
            tokenAddress: token.token_address,
            symbol: token.symbol,
            amount: preparing ? payload.amount : undefined
        }
}

const buildFinalizedSuccess = ({ transaction_id, symbol }) => {
    if(Wallet.getNetwork() === "mainnet"){
        return `You've successfully withdrawn ${symbol} to your L1 account.<br/>Transaction ID: <a target="_blank" href="https://etherscan.io/tx/${transaction_id}">${sliceAddress(transaction_id)}</a>`
    }

    return `You've successfully withdrawn ${symbol} to your L1 account.<br/>Transaction ID: <a target="_blank" href="https://ropsten.etherscan.io/tx/${transaction_id}">${sliceAddress(transaction_id)}</a>`
}

const buildPreparedSuccess = ({ amount, amount_usd, symbol }) => {
    return `You successfully initiated withdrawal preparation of <span>${amount} ${symbol} ($${amount_usd})</span>.<br/><br/>
    This step can take between <span>24 - 48 hours</span>.<br/>
    When a withdrawal is ready you <span>MUST</span> finalize it before the funds become available. Gas fees apply.`
}

const parseFinalizedResult = (result, payload, token) => {
    const { symbol } = token
    const { transactionId: transaction_id } = result

    return {
        transaction_id,
        symbol
    }
}

const parsePreparedResult = (result, payload, token) => {
    const { amount } = payload
    const { withdrawalId: transaction_id } = result
    const { symbol, price } = token

    return {
        transaction_id,
        amount,
        amount_usd: assetToUSD(amount, price),
        symbol: symbol || "ETH",
    }
}

export const handlePrepareCall = async ({link: Link, payload, tokens}) => {
    const payloadCopy = {...payload}
    const token = tokens[payloadCopy.coin]

    try{
        const result = await Link.prepareWithdrawal(extractWithdrawalPayload(payloadCopy, token, true))
        const parsedResult = parsePreparedResult(result, payloadCopy, token)
        const message = buildPreparedSuccess(parsedResult)

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

export const handleFinalizeCall = async ({link: Link, payload, tokens}) => {
    const payloadCopy = {...payload}
    const token = tokens[payloadCopy.coin]

    try{
        const result = await Link.completeWithdrawal(extractWithdrawalPayload(payloadCopy, token))
        const parsedResult = parseFinalizedResult(result, payloadCopy, token)
        const message = buildFinalizedSuccess(parsedResult)

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
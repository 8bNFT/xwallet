import { assetToUSD, parsedToRaw } from "src/util/cfx"
import { Wallet, getFromWallet } from "src/stores/wallet"
import { getCoreSDK, getEtherscanURL, NETWORKS } from "src/util/imx"
import { extractError, sliceAddress } from "src/util/generic"

const extractWithdrawalPayload = (payload, token, preparing = false) => {
    if(token.id === "ETH"){
        return {
            type: "ETH",
            amount: preparing ? payload.amount.wei : undefined,
            amount_parsed: preparing ? payload.amount.parsed : undefined
        }
    }

    return {
        type: "ERC20",
        tokenAddress: token.token_address,
        symbol: token.symbol,
        amount: preparing ? payload.amount.wei : undefined,
        amount_parsed: preparing ? payload.amount.parsed : undefined
    }
}

const buildFinalizedSuccess = ({ transaction_id, symbol }) => {
    if(Wallet.getNetwork() === NETWORKS.MAINNET){
        return `You've successfully withdrawn ${symbol} to your L1 account.<br/>Transaction ID: <a target="_blank" href="${getEtherscanURL()}/tx/${transaction_id}">${sliceAddress(transaction_id)}</a>`
    }

    return `You've successfully withdrawn ${symbol} to your L1 account.<br/>Transaction ID: <a target="_blank" href="${getEtherscanURL()}/tx/${transaction_id}">${sliceAddress(transaction_id)}</a>`
}

const buildPreparedSuccess = ({ amount, amount_usd, symbol }) => {
    return `You successfully initiated withdrawal preparation of <span>${amount} ${symbol} ($${amount_usd})</span>.<br/><br/>
    This step can take between <span>24 - 48 hours</span>.<br/>
    When a withdrawal is ready you <span>MUST</span> finalize it before the funds become available. Gas fees apply.`
}

const parseFinalizedResult = (result, payload, token) => {
    const { symbol } = token
    const { hash: transaction_id } = result

    return {
        transaction_id,
        symbol
    }
}

const parsePreparedResult = (result, payload, token) => {
    const { amount } = payload
    const { withdrawal_id: transaction_id } = result
    const { symbol, price } = token

    return {
        transaction_id,
        amount: amount.parsed,
        amount_usd: assetToUSD(amount.parsed, price),
        symbol: symbol || "ETH",
    }
}

export const handlePrepareCall = async ({ payload: { coin, amount } }) => {
    const token = getFromWallet("Tokens")[coin]
    const payload = { amount: { parsed: amount, wei: parsedToRaw(amount, token.decimals) } }
    const { wallet, walletConnection } = getFromWallet("User")
    const withdrawalPayload = extractWithdrawalPayload(payload, token, true)
    const args = walletConnection ? [walletConnection, withdrawalPayload] : [withdrawalPayload]
    const sdk = walletConnection ? getCoreSDK() : wallet

    try{
        const result = await sdk.prepareWithdrawal(...args)
        const parsedResult = parsePreparedResult(result, payload, token)
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

export const handleFinalizeCall = async ({ payload: { coin } }) => {
    const token = getFromWallet("Tokens")[coin]
    const { wallet, walletConnection } = getFromWallet("User")
    const withdrawalPayload = extractWithdrawalPayload({}, token)
    const args = walletConnection ? 
                [walletConnection.ethSigner, walletConnection.starkSigner.getAddress(), withdrawalPayload] : 
                [withdrawalPayload]
    const sdk = walletConnection ? getCoreSDK() : wallet

    try{
        const result = await sdk.completeWithdrawal(...args)
        const parsedResult = parseFinalizedResult(result, {}, token)
        const message = buildFinalizedSuccess(parsedResult)

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
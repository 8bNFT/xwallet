import { getFromWallet } from "src/stores/wallet"
import { getCoreSDK, getEtherscanURL } from "src/util/imx"
import { extractError, sliceAddress } from "src/util/generic"

const extractWithdrawalPayload = (token, preparing = false) => {
    return {
        type: "ERC721",
        tokenAddress: token.token_address,
        tokenId: token.token_id,
        amount: preparing ? "1" : undefined,
        amount_parsed: preparing ? "1" : undefined
    }
}

const buildFinalizedSuccess = ({ name, id, hash }) => {
    return `You've successfully withdrawn <span>${name} (${id})</span> to your L1 account.<br/><br/>Transaction: <a target="_blank" href="${getEtherscanURL()}/tx/${hash}">${sliceAddress(hash)}</a>`
}

const buildPreparedSuccess = ({ withdrawal_id, name, id }) => {
    return `You successfully initiated withdrawal preparation of <span>${name} (${id})</span>.<br/><br/>
    This step can take between <span>24 - 48 hours</span>.<br/>
    When a withdrawal is ready you <span>MUST</span> finalize it before the NFT becomes available. Gas fees apply.`
}

const parseFinalizedResult = (result, token) => {
    const { hash } = result
    const { name, token_id: id } = token

    return {
        hash,
        name,
        id
    }
}

const parsePreparedResult = (result, token) => {
    const { withdrawal_id } = result
    const { name, token_id: id } = token

    return {
        withdrawal_id,
        name,
        id
    }
}

export const handlePrepareNftCall = async ({ token }) => {
    const { wallet, walletConnection } = getFromWallet("User")
    const withdrawalPayload = extractWithdrawalPayload(token, true)
    const args = walletConnection ? [walletConnection, withdrawalPayload] : [withdrawalPayload]
    const sdk = walletConnection ? getCoreSDK() : wallet

    try{
        const result = await sdk.prepareWithdrawal(...args)
        const parsedResult = parsePreparedResult(result, token)
        const message = buildPreparedSuccess(parsedResult)

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

export const handleFinalizeNftCall = async ({ token }) => {
    const { wallet, walletConnection } = getFromWallet("User")
    const withdrawalPayload = extractWithdrawalPayload(token)
    const args = walletConnection ? 
                [walletConnection.ethSigner, walletConnection.starkSigner.getAddress(), withdrawalPayload] : 
                [withdrawalPayload]
    const sdk = walletConnection ? getCoreSDK() : wallet

    try{
        const result = await sdk.completeWithdrawal(...args)
        const parsedResult = parseFinalizedResult(result, token)
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
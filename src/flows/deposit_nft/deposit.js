import { getFromWallet } from "src/stores/wallet"
import { extractError, sliceAddress } from "src/util/generic"
import { getCoreSDK, getEtherscanURL } from "src/util/imx"

const extractDepositPayload = token => {
    return {
        type: "ERC721",
        tokenAddress: token.token_address,
        tokenId: token.token_id,
        amount: "1",
        amount_parsed: "1"
    }
}

const buildDepositSuccess = ({ name, id, hash }) => {
    const message = `You successfully deposited <span>${name} (${id})</span> to your Immutable X account.<br><br>It may take up to 10 minutes before your balance updates.`
    if(!hash) return message

    const etherscan = `${getEtherscanURL()}/tx/${hash}`
    return message + `<br><br>Transaction: <a target="_blank" href="${etherscan}">${sliceAddress(hash)}</a>`
}

const parseDepositResult = ({ token, hash }) => {
    return {
        hash,
        name: token.name,
        id: token.token_id
    }
}

export const handleNftDepositCall = async ({ token }) => {
    const { wallet, walletConnection } = getFromWallet("User")
    const depositPayload = extractDepositPayload(token)
    const sdk = walletConnection ? getCoreSDK() : wallet
    const args = walletConnection ? [walletConnection.ethSigner, depositPayload] : [depositPayload]

    try{
        const result = await sdk.deposit(...args)
        const parsedResult = parseDepositResult({ token, hash: result?.hash })
        const message = buildDepositSuccess(parsedResult)

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
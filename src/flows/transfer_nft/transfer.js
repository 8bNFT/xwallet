import { getFromWallet } from "src/stores/wallet"
import { getCoreSDK, invalidateAssetsCache } from "src/util/imx"
import { extractError, sliceAddress } from "src/util/generic"

const extractNFTTransferPayload = (tokens, receiver) => {
    return tokens.map(({ token_id, token_address}) => ({ type: "ERC721", receiver, tokenId: token_id, tokenAddress: token_address }))
}

const buildTransferSuccess = ({ receiver, transfers }) => {
    return `You successfully sent <span>${transfers.length} NFTs</span> to <span>${sliceAddress(receiver, 8)}</span>.`
}

export const handleNftTransferCall = async ({ receiver, tokens }) => {
    const { wallet, walletConnection, address } = getFromWallet("User")
    const transferPayload = extractNFTTransferPayload(tokens, receiver)
    const args = walletConnection ? [walletConnection, transferPayload] : [transferPayload]
    const sdk = walletConnection ? getCoreSDK() : wallet

    try{
        const { transfer_ids } = await sdk.batchNftTransfer(...args)
        if(!transfer_ids) throw "Error occurred while trying to process your transfer"

        const message = buildTransferSuccess({ receiver, transfers: transfer_ids })
        invalidateAssetsCache(address)

        return {
            result: { receiver, transfers: transfer_ids },
            message
        }
    }catch(err){
        return {
            error: extractError(err)
        }
    }
}
import { Link } from "@imtbl/imx-sdk"
import { ToastStore } from "src/stores/toast"
import { getLinkURL } from "src/util/imx"
import { createBaseWalletClass } from "./base_wallet"
import { getLastUsedWallet, setLastUsedWallet } from "./helpers"

const IDENTIFIER = "IMX_LINK"
const NAME = "IMX Link"
const ICON = "https://market.immutable.com/apple-touch-icon.png"

const BaseWalletClass = createBaseWalletClass({ name: NAME, identifier: IDENTIFIER, icon: ICON })

export class IMXLink extends BaseWalletClass {
    constructor(network){
        super(network)

        this.Link = new Link(getLinkURL(network))
        return new Proxy(this, this)
    }

    get(target, prop){
        if(target[prop]) return target[prop]
        if(target.Link[prop]) return target.Link[prop]
        return
    }

    static isAvailable(){
        if(Link) return true
        return false
    }

    isAvailable(){
        return this.constructor.isAvailable()
    }

    async connect(){
        try{
            const { address, starkPublicKey } = await this.Link.setup({ providerPreference: "none" })
            const wallet_object = {
                identifier: this.getIdentifier(),
                address,
                starkPublicKey,
            }

            this.wallet = {...wallet_object, wallet: this}
            setLastUsedWallet(this.network, wallet_object)
            return this.wallet
        }catch(err){
            ToastStore.error(err.message || err)
            console.error(err)
            return false
        }
    }

    disconnect(){
        const { identifier } = getLastUsedWallet(this.network)
        if(identifier !== this.getIdentifier()) return
        this.emitAccountChange(false)
        setLastUsedWallet(this.network, {})
    }

    address(){
        return this.wallet?.address || false
    }

    async checkExistingSession(){
        const { identifier, address, starkPublicKey } = getLastUsedWallet(this.network)
        if(identifier !== this.getIdentifier()) return false

        this.wallet = { identifier, address, starkPublicKey, wallet: this }
        return this.wallet
    }

    supports(action){
        return ["onramp", "offramp"].includes(action.toLowerCase())
    }

    // custom implementation of methods
    async transfer({ type, symbol, tokenAddress, tokenId, amount_parsed, receiver }){
        const { result } = await this.Link.transfer(
            [
                { 
                    type, 
                    symbol, 
                    tokenAddress, 
                    tokenId,
                    amount: amount_parsed, 
                    toAddress: receiver 
                }
            ]
        )

        if(!result || !result.length) throw "Error occured while trying to process your transfer"
        const { status, txId: transfer_id, amount, message } = result[0]
        return {
            status,
            transfer_id,
            amount,
            message
        }
    }

    async batchNftTransfer(nfts){
        const payload = []
        for(let { type, receiver: toAddress, tokenId, tokenAddress } of nfts){
            if(type !== "ERC721") continue
            payload.push({ type, toAddress, tokenAddress, tokenId })
        }

        const { result } = await this.Link.batchNftTransfer(payload)
        if(!result || !result.length) throw "Error occured while trying to process transfers"

        return { transfer_ids: result.map(v => v.txId) }
    }
    
    async deposit({ type, symbol, tokenAddress, tokenId, amount_parsed }){
        return this.Link.deposit({ type, symbol, tokenAddress, tokenId, amount: amount_parsed })
    }

    async prepareWithdrawal({ type, symbol, tokenAddress, tokenId, amount_parsed: amount }){
        const { withdrawalId: withdrawal_id } = await this.Link.prepareWithdrawal({ type, symbol, tokenAddress, tokenId, amount })
        return {
            status: withdrawal_id ? "success" : "error",
            withdrawal_id
        }
    }

    async completeWithdrawal({ type, symbol, tokenAddress, tokenId }){
        const { transactionId: hash } = await this.Link.completeWithdrawal({ type, symbol, tokenAddress, tokenId })
        return {
            status: hash ? "success" : "error",
            hash
        }
    }
}
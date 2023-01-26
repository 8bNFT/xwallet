import { NETWORKS } from "src/util/imx"
import { createBaseWalletClass } from "./base_wallet"
import { getLastUsedWallet, setLastUsedWallet } from "./helpers"

const IDENTIFIER = "DUMMY"
const NAME = "Dummy Wallet"
const ICON = "https://market.immutable.com/apple-touch-icon.png"

const BaseWalletClass = createBaseWalletClass({ name: NAME, identifier: IDENTIFIER, icon: ICON })

export class DummyWallet extends BaseWalletClass {
    constructor(network){
        super(network)
    }

    static isAvailable(){
        return true
    }

    isAvailable(){
        return this.constructor.isAvailable()
    }

    async connect(){
        const wallet_object = {
            identifier: this.getIdentifier(),
            address: "0xc8c3d38A5DB18272D99BfD376aA74F6a070B433F",
            starkPublicKey: "0x07f4dccef901a2084f780880ecffc24664bbdc37be892c17923305843cda4c8d"
        }

        this.wallet = { ...wallet_object, wallet: this }
        setLastUsedWallet(this.network, wallet_object)

        return this.wallet
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

    // custom implementation of methods
    async transfer({ type, symbol, tokenAddress, tokenId, amount_parsed, receiver }){
        const TRANSFERS = {
            ERC721: 3476179,
            ERC20: 3475927,
            ETH: 3475972 
        }

        return {
            status: "success",
            transfer_id: TRANSFERS[type],
            amount: amount_parsed,
            message: "SUCCESS"
        }
    }

    async batchNftTransfer(nfts){
        return { transfer_ids: nfts.map(_ => 3476179) }
    }
    
    async deposit({ type, symbol, tokenAddress, tokenId, amount_parsed }){
        return { hash: "0xd3479a1a240ef5296dd7474813ff7f56337852ee42affcbfd239685a63a9897d" }
    }

    async prepareWithdrawal({ type, symbol, tokenAddress, tokenId, amount_parsed: amount }){
        const WITHDRAWALS = {
            ERC721: 3475118,
            ERC20: 3357434,
            ETH: 3474747
        }

        return {
            status: "success",
            withdrawal_id: WITHDRAWALS[type]
        }
    }

    async completeWithdrawal({ type, symbol, tokenAddress, tokenId }){
        return {
            status: "success",
            hash: "0xb2bc751d677a9c68d5d8ec68b1313704d09e89fb1155344240671250d2c7f7b6"
        }
    }
}
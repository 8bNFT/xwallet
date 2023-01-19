import { Link } from "@imtbl/imx-sdk"
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
        if(!identifier !== this.getIdentifier()) return false

        this.wallet = { identifier, address, starkPublicKey, wallet: this }
        return this.wallet
    }

    supports(action){
        return ["onramp", "offramp"].includes(action.toLowerCase())
    }
}
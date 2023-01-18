import { Link } from "@imtbl/imx-sdk"
import { getLinkURL } from "src/util/imx"
import { getLastUsedWallet, setLastUsedWallet } from "./helpers"

const IDENTIFIER = "IMX_LINK"

export class IMXLink {
    constructor(network){
        this.network = network
        this.identifier = IDENTIFIER
        this.Link = new Link(getLinkURL(network))
    }

    static getIdentifier(){
        return IDENTIFIER
    }

    onAccountChange(_){}

    isAvailable(){
        if(this.Link) return true
        return false
    }

    async login(){
        try{
            const { address, starkPublicKey } = await this.Link.setup({ providerPreference: "none" })
            const wallet_object = {
                identifier: this.identifier,
                address,
                starkPublicKey
            }

            this.wallet = wallet_object
            setLastUsedWallet(this.network, this.wallet)
            return wallet_object
        }catch(err){
            console.error(err)
            return false
        }
    }

    logout(){
        if(!this.checkExistingSession()) return
        setLastUsedWallet(this.network, {})
    }

    address(){
        return this.wallet?.address || false
    }

    checkExistingSession(){
        const { identifier, address, starkPublicKey } = getLastUsedWallet(this.network)
        if(!identifier !== this.identifier) return false

        this.wallet = { identifier, address, starkPublicKey }
        return this.wallet
    }
}
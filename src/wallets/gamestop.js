import { addCachedStarkPrivateKey, createWalletConnection, getCachedStarkPrivateKey, getLastUsedWallet, setLastUsedWallet } from "./helpers"
import { CHAIN_ID } from "src/util/blockchain"
import { ethers } from "ethers"
import { generateLegacyStarkPrivateKey } from "@imtbl/core-sdk"
import { createBaseWalletClass } from "./base_wallet"
import { ToastStore } from "src/stores/toast"

const IDENTIFIER = "GAMESTOP"
const NAME = "Gamestop"
const ICON = "https://is3-ssl.mzstatic.com/image/thumb/Purple123/v4/30/cd/3a/30cd3a4a-301f-1e00-0899-94d3fb5d07cf/AppIcon-0-1x_U007emarketing-0-5-0-85-220.png/246x0w.webp"

const getWindowObject = () => window.gamestop ? window.gamestop : window.ethereum && window.ethereum.isGamestop ? window.ethereum : false

const BaseWalletClass = createBaseWalletClass({ name: NAME, identifier: IDENTIFIER, icon: ICON })

export class Gamestop extends BaseWalletClass {
    constructor(network){
        super(network)

        this.chain_id = CHAIN_ID[network]
        if(!this.isAvailable()) return this

        this.gamestop = getWindowObject()
        this.gamestop.on('accountsChanged', this.accountChangeHandler.bind(this))
        this.gamestop.on('disconnect', () => this.accountChangeHandler([]))
        this.ethers = new ethers.providers.Web3Provider(this.gamestop)
    }

    async accountChangeHandler(accounts){
        if(!accounts.length) return this.disconnect()
        const wallet = await this.checkExistingSession()
        if(!wallet) return this.disconnect()
        this.emitAccountChange(wallet)
    }

    static isAvailable(){
        return getWindowObject() !== false
    }

    isAvailable(){
        return this.constructor.isAvailable()
    }

    createWalletObject(signer, starkPrivateKey){
        const walletConnection = createWalletConnection(signer, starkPrivateKey)

        return {
            identifier: this.getIdentifier(),
            walletConnection,
            address: this.address(),
            starkPublicKey: walletConnection.starkSigner.getAddress(),
            wallet: this
        }
    }

    async getPermissions(){
        try{
            return await this.gamestop.request({
                method: 'wallet_requestPermissions',
                params: [{ eth_accounts: {} }]
            })
        }catch(err){
            if(err.code === 4001){
                console.debug('Connection to Metamask declined')
                throw 'METAMASK_DECLINED'
            }

            throw err
        }
    }

    async getAccounts(){
        return this.gamestop.request({ method: 'eth_requestAccounts' })
    }

    async getAccount(){
        const accounts = await this.getAccounts()
        if(accounts && accounts.length) return accounts[0]
        try{
            await this.getPermissions()
        }catch(err){
            console.error(err)
            return false
        }

        const accounts_retry = await this.getAccounts()
        if(!accounts_retry || !accounts_retry.length) return false
        return accounts_retry[0]
    }

    async connect(){
        if(!this.isAvailable()) return false
        try{
            const address = await this.getAccount()
            if(!address) return false

            const ether_signer = this.ethers.getSigner()
            const starkPrivateKey = getCachedStarkPrivateKey(address) || await generateLegacyStarkPrivateKey(ether_signer)
            if(!starkPrivateKey){
                ToastStore.error("Cannot generate stark account for " + address)
                return false
            }
            
            this.wallet = this.createWalletObject(ether_signer, starkPrivateKey)
            addCachedStarkPrivateKey(address, starkPrivateKey)
            setLastUsedWallet(this.network, { identifier: this.getIdentifier() })

            return this.wallet
        }catch(err){
            ToastStore.error(err.code || err.message || err)
            console.error("[WALLET CONNECTION]", err)
            return false
        }
    }

    async disconnect(){
        const { identifier } = getLastUsedWallet(this.network)
        if(identifier !== this.getIdentifier()) return false
        this.emitAccountChange(false)
        setLastUsedWallet(this.network, {})
        return false
    }

    address(){
        return this.gamestop.currentAddress
    }

    _provider_connected(){
        return this.gamestop.isConnected()
    }

    // make this an async requirement so we can send async request to the provider?
    // if last used identifier === GAMESTOP this.getAccounts()
    async checkExistingSession(){
        if(!this.isAvailable()) return false
        if(!this._provider_connected()) return false
        
        const { identifier } = getLastUsedWallet(this.network)
        if(identifier !== this.getIdentifier()) return false
        
        await this.getAccount()
        if(!this.address()) return false

        const starkPrivateKey = getCachedStarkPrivateKey(this.address())
        if(!starkPrivateKey) return false

        this.wallet = this.createWalletObject(this.ethers.getSigner(), starkPrivateKey)
        return this.wallet
    }
}
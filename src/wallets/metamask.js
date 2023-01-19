import { addCachedStarkPrivateKey, createWalletConnection, getCachedStarkPrivateKey, getLastUsedWallet, setLastUsedWallet } from "./helpers"
import { CHAIN_ID } from "src/util/blockchain"
import { ethers } from "ethers"
import { generateLegacyStarkPrivateKey } from "@imtbl/core-sdk"
import { createBaseWalletClass } from "./base_wallet"

const IDENTIFIER = "METAMASK"
const NAME = "MetaMask"
const ICON = "https://link.x.immutable.com/static/media/metamask-logo.45038d58.svg"

const BaseWalletClass = createBaseWalletClass({ name: NAME, identifier: IDENTIFIER, icon: ICON })

export class MetaMask extends BaseWalletClass {
    constructor(network){
        super(network)

        this.chain_id = CHAIN_ID[network]
        if(!this.isAvailable()) return this

        this.ethereum = window.ethereum
        this.ethereum.on('accountsChanged', this.accountChangeHandler.bind(this))
        this.ethereum.on('disconnect', () => this.accountChangeHandler([]))
        this.ethers = new ethers.providers.Web3Provider(this.ethereum)
    }

    async accountChangeHandler(accounts){
        if(!accounts.length) return this.disconnect()
        const wallet = await this.checkExistingSession()
        if(!wallet) return this.disconnect()
        this.emitAccountChange(wallet)
    }

    static isAvailable(){
        if(window.ethereum && window.ethereum.isMetaMask) return true
        return false
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
            return await this.ethereum.request({
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
        return this.ethereum.request({ method: 'eth_requestAccounts' })
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
            if(!starkPrivateKey) return false
            
            this.wallet = this.createWalletObject(ether_signer, starkPrivateKey)
            addCachedStarkPrivateKey(address, starkPrivateKey)
            setLastUsedWallet(this.network, { identifier: this.getIdentifier() })

            return this.wallet
        }catch(err){
            console.error("[WALLET CONNECTION]", err)
            return false
        }
    }

    async disconnect(){
        const { identifier } = getLastUsedWallet(this.network)
        if(identifier !== this.getIdentifier()) return
        this.emitAccountChange(false)
        setLastUsedWallet(this.network, {})
    }

    address(){
        return this.ethereum.selectedAddress || false
    }

    async checkExistingSession(){
        if(!this.isAvailable()) return false
        if(!this.address()) return false

        const { identifier } = getLastUsedWallet(this.network)
        if(identifier !== this.getIdentifier()) return false

        const starkPrivateKey = getCachedStarkPrivateKey(this.address())
        if(!starkPrivateKey) return false

        this.wallet = this.createWalletObject(this.ethers.getSigner(), starkPrivateKey)
        return this.wallet
    }
}
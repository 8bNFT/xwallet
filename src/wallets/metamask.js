import { addCachedStarkPrivateKey, getCachedStarkPrivateKey, getLastUsedWallet, setLastUsedWallet } from "./helpers"
import { CHAIN_ID } from "src/util/blockchain"
import { ethers } from "ethers"
import { createStarkSigner, generateLegacyStarkPrivateKey } from "@imtbl/core-sdk"

const IDENTIFIER = "METAMASK"

export class MetaMask {
    constructor(network){
        this.network = network
        this.chain_id = CHAIN_ID[network]
        this.identifier = IDENTIFIER
        this.callback = () => {}
        if(!this.isAvailable()) return
        this.ethereum = window.ethereum
        this.ethereum.on('accountsChanged', this.accountChangeHandler.bind(this))
        this.ethereum.on('disconnect', () => this.accountChangeHandler([]))
        this.ethers = new ethers.providers.Web3Provider(this.ethereum)
    }

    static getIdentifier(){
        return IDENTIFIER
    }

    onAccountChange(callback){
        this.callback = callback
    }

    accountChangeHandler(accounts){
        if(!accounts.length) return this.callback(false)
        const wallet = this.checkExistingSession()
        if(!wallet) return this.callback(false)
        this.callback(wallet)
    }

    isAvailable(){
        if(window.ethereum && window.ethereum.isMetaMask) return true
        return false
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

    async login(){
        if(!this.isAvailable()) return false
        try{
            const address = await this.getAccount()
            if(!address) return false

            const ether_signer = this.ethers.getSigner()
            const starkPrivateKey = getCachedStarkPrivateKey(address) || await generateLegacyStarkPrivateKey(ether_signer)
            if(!starkPrivateKey) return false

            addCachedStarkPrivateKey(address, starkPrivateKey)
            const stark_signer = createStarkSigner(starkPrivateKey)

            this.wallet = {
                identifier: this.identifier,
                ether_signer,
                address,
                stark_signer,
                starkPublicKey: stark_signer.getAddress()
            }

            setLastUsedWallet(this.network, { identifier: this.identifier })
            return this.wallet
        }catch(err){
            console.error("[WALLET CONNECTION]", err)
            return false
        }
    }

    async logout(){
        const { identifier } = getLastUsedWallet(this.network)
        if(identifier !== this.identifier) return
        setLastUsedWallet(this.network, {})
    }

    address(){
        return this.ethereum.selectedAddress || false
    }

    checkExistingSession(){
        if(!this.isAvailable()) return false
        if(!this.address()) return false

        const { identifier } = getLastUsedWallet(this.network)
        if(identifier !== this.identifier) return false

        const starkPrivateKey = getCachedStarkPrivateKey(this.address())
        if(!starkPrivateKey) return false

        const stark_signer = createStarkSigner(starkPrivateKey)

        this.wallet = {
            identifier,
            ether_signer: this.ethers.getSigner(),
            address: this.address(),
            stark_signer,
            starkPublicKey: stark_signer.getAddress()
        }

        return this.wallet
    }
}
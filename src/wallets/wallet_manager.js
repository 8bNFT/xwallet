import { ToastStore } from "src/stores/toast"
import { sliceAddress } from "src/util/generic"
import { DummyWallet } from "./dummy_wallet"
import { Gamestop } from "./gamestop"
import { getLastUsedWallet } from "./helpers"
import { IMXLink } from "./imx_link"
import { MetaMask } from "./metamask"

export class WalletManager {
    constructor(network, user){
        this.network = network
        this.wallets = {
            [MetaMask.getIdentifier()]: new MetaMask(network),
            [Gamestop.getIdentifier()]: new Gamestop(network),
            [IMXLink.getIdentifier()]: new IMXLink(network),
            ...(["localhost", "127.0.0.1"].includes(window.location.hostname) && {[DummyWallet.getIdentifier()]: new DummyWallet(network)} || {})
        }

        this.user = user
    }

    getWalletTypes(){
        return Object.keys(this.wallets)
    }

    getWallet(identifier){
        const id = identifier.toUpperCase()
        if(!id in this.wallets) throw "Unknown wallet identifier " + id
        const wallet = this.wallets[id]
        if(!wallet.isAvailable()) return false
        return {
            ...wallet.getWalletInfo(),
            wallet,
        }
    }

    getWallets(){
        return Object.entries(this.wallets).reduce((dict, [id, wallet]) => {
            dict[id] = { ...wallet.getWalletInfo(), wallet }
            return dict
        }, {})
    }

    getAvailableWallets(){
        const wallets = {}
        for(let [id, wallet] of Object.entries(this.wallets)){
            if(!wallet.isAvailable()) continue
            wallets[id] = {
                ...wallet.getWalletInfo(),
                wallet
            }
        }

        return wallets
    }

    listenToChanges(wallet){
        wallet.onAccountChange(wallet_object => {
            if(wallet.getIdentifier() !== getLastUsedWallet(this.network).identifier) return
            this.user.set(wallet_object)
            if(wallet_object.address) ToastStore.success("Account changed " + sliceAddress(wallet_object.address))
        }, "wallet_manager")
    }

    async connect(id){
        const provider = this.getWallet(id)
        if(!provider) return false
        const { wallet } = provider
        const wallet_object = await wallet.connect()
        this.user.set(wallet_object)
        this.listenToChanges(wallet)
    }

    async checkExistingSession(){
        const { identifier } = getLastUsedWallet(this.network)
        if(!identifier) return false
        const provider = this.getWallet(identifier)
        if(!provider) return false
        const { wallet } = provider
        this.user.set(await wallet.checkExistingSession())
        this.listenToChanges(wallet)
    }
}

// const createUserStore = async network => {
//     const { subscribe, set, update } = writable(false);

//     function checkSession(){
//         const cached = localStorage.getItem('wallet_' + network)
//         if(!cached) return false

//         const info = JSON.parse(cached)
//         update(v => v.address && v.network === network ? v : info)
//         return info
//     }

//     async function login(){
//         try{
//             const { address, starkPublicKey } = await get(Link).setup({ providerPreference: "none" })
//             set({address, starkPublicKey, network})
//             localStorage.setItem('wallet_' + network, JSON.stringify({address, starkPublicKey, network}))
//             return { address, starkPublicKey, network }
//         }catch(err){
//             console.error(err)
//             return false
//         }
//     }

//     function logout(){
//         localStorage.removeItem('wallet_' + network)
//         set(false)
//     }

//     checkSession()

//     return {
//         subscribe,
//         login,
//         logout
//     }
// }
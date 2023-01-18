import { Gamestop } from "./gamestop"
import { IMXLink } from "./imx_link"
import { MetaMask } from "./metamask"

export class WalletManager {
    constructor(network){
        this.wallets = {
            [IMXLink.getIdentifier()]: new IMXLink(network),
            [Gamestop.getIdentifier()]: new Gamestop(network),
            [MetaMask.getIdentifier()]: new MetaMask(network)
        }
    }

    getWallet(identifier){
        const id = identifier.toUpperCase()
        if(!id in this.wallets) throw "Unknown wallet identifier " + id
        const wallet = this.wallets[id]
        if(!wallet.isAvailable()) return false
        return wallet
    }

    getWallets(){
        return this.wallets
    }

    getWalletTypes(){
        return Object.keys(this.wallets)
    }

    getAvailableWallets(){
        const wallets = {}
        for(let [id, wallet] of Object.entries(this.wallets)){
            if(!wallet.isAvailable()) continue
            wallets[id] = wallet
        }

        return wallets
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
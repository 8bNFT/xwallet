export const createBaseWalletClass = ({ identifier, name, icon }) => {
    return class BaseWallet {
        constructor(network){
            this.network = network
            this.callbacks = {}
        }

        static getIdentifier(){
            return identifier
        }

        getIdentifier(){
            return this.constructor.getIdentifier()
        }

        static getName(){
            return name
        }

        getName(){
            return this.constructor.getName()
        }

        static getIcon(){
            return icon
        }

        getIcon(){
            return this.constructor.getIcon()
        }

        static getWalletInfo(){
            return {
                identifier,
                name,
                icon
            }
        }

        getWalletInfo(){
            return this.constructor.getWalletInfo()
        }

        static isAvailable(){
            return true
        }

        isAvailable(){
            return true
        }

        onAccountChange(callback, id = false){
            if(typeof callback !== "function") throw "Callback must be a function"
            this.callbacks[id || `cb-${Date.now()}`] = callback
        }

        removeOnAccountChange(id){
            delete this.callbacks[id]
        }

        emitAccountChange(args){
            for(let callback of Object.values(this.callbacks)){
                callback(args)
            }
        }

        supports(_){
            return false
        }
    }
}
import { createGenericStore } from "./generics"

const createPromise = () => {
    let resolver
    const promise = new Promise((resolve, reject) => resolver = { resolve, reject })

    return {
        promise,
        resolver
    }
}

function createFlowStore(){
	const { subscribe, set, update, reset } = createGenericStore({ flow: false, props: {} })
    
	const deposit = (token, promise) => set({ flow: "deposit", props: token && { coin: { value: token } } || {} })
	const withdraw = (token, promise) => set({ flow: "withdraw", props: token && { coin: { value: token } } || {} })
	const transfer = (token, promise) => set({ flow: "transfer", props: token && { coin: { value: token } } || {} })
	const buy = (token, promise) => set({ flow: "buy", props: token && { coin: token } || {} })
	const sell = (token, promise) => set({ flow: "sell", props: token && { coin: { value: token } } || {} })
	const coinInformation = (token, promise) => !token ? null: set({ flow: "coin", props: { coin: token  } })

	const depositNFT = (token, promise) => set({ flow: "depositNFT", props: { token } })
	const withdrawNFT = (token, promise) => set({ flow: "withdrawNFT", props: { token } })
	const transferNFTs = (store, promise) => store.length() ? set({ flow: "transferNFT", props: { assetStore: store, promise } }) : null

    const wrapWithPromise = fn => {
        return (...args) => {
            const { promise, resolver } = createPromise()
            fn(...args, resolver)
            return promise
        }
    }

	return {
		subscribe,
		set,
		update,
		reset,
		deposit,
		withdraw,
		transfer,
		buy,
		sell,
		send: transfer,
		coinInformation,
		depositNFT: wrapWithPromise(depositNFT),
		withdrawNFT: wrapWithPromise(withdrawNFT),
		transferNFTs: wrapWithPromise(transferNFTs)
	}
}

export const FlowStore = createFlowStore()
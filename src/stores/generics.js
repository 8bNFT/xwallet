import { writable } from 'svelte/store';

export function createGenericStores([...payloads]){
	const stores = payloads.map(p => createGenericStore(p))
	const resetAll = ()=> stores.forEach(s => s.reset())

	return {
		resetAll,
		stores
	}
}

export function createGenericStore(initialPayload){
	const initial = {...initialPayload}
	const { subscribe, set, update } = writable(initialPayload);

	return {
		subscribe,
        set,
        update,
		reset: () => set(initial)
	};
}

export function withValidation(payload){
	const validationStore = {}
	const payloadStore = {}

	for(let [k, v] of Object.entries(payload)){
		const { validators, valid = true, error = false, value, reactiveRevalidation = true } = v
		validationStore[k] = {
			validators,
			valid,
			error,
			reactiveRevalidation
		}

		payloadStore[k] = value
	}

	return [payloadStore, validationStore]
}

function createFlowStore(){
	const { subscribe, set, update, reset } = createGenericStore({ flow: false, props: {} })

	const deposit = token => set({ flow: "deposit", props: token && { coin: { value: token } } || {} })
	const transfer = token => set({ flow: "transfer", props: token && { coin: { value: token } } || {} })
	const buy = token => set({ flow: "buy", props: token && { coin: token } || {} })
	const sell = token => set({ flow: "sell", props: token && { coin: { value: token } } || {} })
	const coinInformation = token => set({ flow: "coin", props: { coin: token  } })
	// const deposit = (token) => set({ flow: "deposit", props: { coin: { value: token } } })

	return {
		subscribe,
		set,
		update,
		reset,
		deposit,
		transfer,
		buy,
		sell,
		send: transfer,
		coinInformation
	}
}

export const FlowStore = createFlowStore()
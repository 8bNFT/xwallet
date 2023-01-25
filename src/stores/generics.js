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
	const initial = typeof initialPayload === "object" ? {...initialPayload} : initialPayload
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

export const createOpenCloseStore = initial => {
	let current = initial || false
	const { subscribe, set: _set } = writable(current);

	const set = v => {
		current = v
		_set(current)
	}

	return {
		subscribe,
		open: () => set(true),
		close: () => set(false),
		toggle: () => set(!current),
		state: () => current,
		reset: () => set(initial)
	};
}

export const WalletDropdown = createOpenCloseStore()
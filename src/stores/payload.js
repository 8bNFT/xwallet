import { writable } from 'svelte/store';

export function createPayloadStore(initialPayload) {
    const initial = initialPayload
	const { subscribe, set, update } = writable(initialPayload);

	return {
		subscribe,
        set,
        update,
		reset: () => set(initial)
	};
}
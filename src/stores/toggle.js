import { writable } from 'svelte/store';

export function createToggleStore([a, b]) {
    const options = [a, b]
	const { subscribe, set, update } = writable(options[0]);
    
    const toggle = () => update(
        current => {
            if(current === a) return b
            return a
        }
    )

    const setOption = option => {
        if(!options.includes(option)) throw "Option not available " + option
        return set(option)
    }

	return {
		subscribe,
		toggle,
		options: () => options,
        set: setOption
	};
}
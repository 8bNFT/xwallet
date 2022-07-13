import { writable } from 'svelte/store';

export function createToggleStore([a, b]) {
    const options = [a, b]
	const { subscribe, set, update } = writable(options[0]);
    const { subscribe: _options_sub, set: _options_set } = writable(options);
    const { subscribe: _state_sub, set: _state_set } = writable(false);
    
    const toggle = () => update(
        current => {
            if(current === options[0]) return options[1]
            return options[0]
        }
    )

    const setOption = option => {
        if(!options.includes(option)) throw "Option not available " + option
        return set(option)
    }

    const updateOption = (index, newOption) => {
        const current = options[index]
        options[index] = newOption
        update(v => v === current ? newOption : v)
        _options_set(options)
    }

    const enable = () => {
        _state_set(false)
    }

    const disable = () => {
        _state_set(true)
    }

	return {
		subscribe,
		toggle,
		options: { subscribe: _options_sub },
        set: setOption,
        updateOption,
        disabled: { subscribe: _state_sub },
        enable,
        disable
	};
}
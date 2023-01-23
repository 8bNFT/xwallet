import { writable } from 'svelte/store';

export const createNftTransferStore = () => {
    let current = {}

    const { subscribe, set: _set } = writable({})
    const set = v => { current = v; _set(v) }

    const length = () => Object.entries(current).reduce((cv, [_, v]) => cv + v.length, 0)

    const contains = token => {
        const address = token.token_address.toLowerCase()
        if(!(address in current)) return false
        if(current[address].findIndex(v => v.token_id === token.token_id) === -1) return false
        return true
    }

    const select = token => {
        const address = token.token_address.toLowerCase()
        if(!(address in current)) set({...current, [address]: []})
        if(current[address].findIndex(v => v.token_id === token.token_id) !== -1) return
        current[address].push(token)
        set(current)
    }

    const deselect = token => {
        const address = token.token_address.toLowerCase()
        if(!(address in current)) return
        const idx = current[address].findIndex(v => v.token_id === token.token_id)
        if(idx === -1) return
        current[address].splice(idx, 1)
        set(current)
    }

    const toggle = token => {
        if(contains(token)) return deselect(token)
        select(token)
    }

    return {
        subscribe, 
        length,
        contains,
        select,
        deselect,
        toggle,
        reset: () => set({})
    }
}
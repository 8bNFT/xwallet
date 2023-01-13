import { writable } from 'svelte/store';

export const createNftTransferStore = () => {
    let current = {}

    const { subscribe, set: _set } = writable({})
    const set = v => { current = v; _set(v) }

    const length = () => Object.entries(current).reduce((cv, [_, v]) => cv + v.size, 0)

    const contains = ({ address, id }) => {
        const _address = address.toLowerCase()
        if(!(_address in current)) return false
        if(!current[_address].has(String(id))) return false
        return true
    }

    const select = ({ address, id }) => {
        const _address = address.toLowerCase()
        if(!(_address in current)) set({...current, [_address]: new Set()})
        if(current[_address].has(String(id))) return
        current[_address].add(String(id))
        set(current)
    }

    const deselect = ({ address, id }) => {
        const _address = address.toLowerCase()
        if(!(_address in current)) return
        current[_address].delete(String(id))
        set(current)
    }

    return {
        subscribe, 
        length,
        contains,
        select,
        deselect,
        reset: () => set({})
    }
}
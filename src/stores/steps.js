import { get, writable } from 'svelte/store';

export function createStepStore(maxSteps, loop = false) {
	const { subscribe, set, update } = writable(0);
    const MAX_STEPS = maxSteps - 1
    const CAN_LOOP = loop

    const next = () => update(
        current => {
            const temp = current + 1
            if(temp > MAX_STEPS){
                if(loop) return 0
                return MAX_STEPS
            }

            return temp
        }
    )

    const prev = () => update(
        current => {
            const temp = current - 1
            if(temp < 0){
                if(loop) return MAX_STEPS
                return 0
            }

            return temp
        }
    )

    const goto = step => {
        if(step < 0){
            if(loop) return set(MAX_STEPS)
            return set(0)
        }

        if(step > MAX_STEPS){
            if(loop) return set(0)
            return set(MAX_STEPS)
        }

        return set(step)
    }

	return {
		subscribe,
		next,
        prev,
        goto,
		reset: () => set(0),
        getMaxIter: () => MAX_STEPS + 1,
        getMax: () => MAX_STEPS,
        canLoop: () => CAN_LOOP
	};
}
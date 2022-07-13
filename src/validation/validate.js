import { get } from "svelte/store"

const runValidators = async ({validators, value}, controller) => {
    for(let [validator, message] of validators){
        const validationResult = await validator(value, controller)
        if(!validationResult){
            if(typeof message === "function") return { message: message() }
            return { message }
        }
    }

    return true
}

export const validate = async (payload, validationStore, controllerStore = {}, emptyInvalid = false) => {
    const { controller: previousController } = controllerStore
    if(previousController) previousController.abort()

    const controller = new AbortController()
    controllerStore.controller = controller

    const validationPayload = {...get(validationStore)}

    for(let [k, v] of Object.entries(payload)){
        validationPayload[k].valid = true
        validationPayload[k].error = false

        if(!v.validators || (!emptyInvalid && (typeof v.value === "undefined" || v.value === "" || v.value === null))) continue

        const validationResult = await runValidators(v, controller)
        if(validationResult === true) continue

        validationPayload[k] = {
            valid: false,
            error: validationResult.message || ""
        }
    }

    if(controller.signal.aborted === true) return
    validationStore.set(validationPayload)
}

export const allValid = (payload, emptyInvalid = false) => {
    // for(let [k, v] of Object.entries(payload)){
    //     if(!v.validators || (!emptyInvalid && (typeof v.value === "undefined" || v.value === "" || v.value === null)) || runValidators(v.validators, v.value)){
    //         continue
    //     }
        
    //     return false
    // }

    return true
}
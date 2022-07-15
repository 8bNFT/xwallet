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

export const validate = async ({ payloadStore, validationStore, currentController = {}, emptyInvalid = false }) => {
    const { controller: previousController } = currentController
    if(previousController) previousController.abort()

    const controller = new AbortController()
    currentController.controller = controller

    const validationPayload = {...get(validationStore)}

    for(let [k, value] of Object.entries(payloadStore)){
        if(!validationPayload[k]) continue

        const { value: previousValue, reactiveRevalidation, validators } = validationPayload[k]
        if(previousValue === value && reactiveRevalidation === false) continue

        validationPayload[k] = {
            ...validationPayload[k],
            value,
            valid: true,
            error: false
        }

        if(!validators || (!emptyInvalid && (typeof value === "undefined" || value === "" || value === null))) continue

        const validationResult = await runValidators({ validators, value }, controller)
        if(validationResult === true) continue

        validationPayload[k] = {
            ...validationPayload[k],
            valid: false,
            error: validationResult.message || ""
        }
    }

    if(controller.signal.aborted === true) return
    validationStore.set(validationPayload)
}

export const allValid = ({ payloadStore, validationStore, emptyInvalid = false, currentController }) => {
    const { controller: previousController } = currentController
    if(previousController) previousController.abort()

    const controller = new AbortController()
    currentController.controller = controller

    for(let k of Object.keys(payloadStore)){
        if(!validationStore[k]) continue

        const value = payloadStore[k]
        const { valid } = validationStore[k]

        if(controller.signal.aborted === true) return
        if(emptyInvalid === true && (typeof value === "undefined" || value === "" || value === null)) return false
        if(!valid) return false
    }

    if(controller.signal.aborted === true) return
    return true
}
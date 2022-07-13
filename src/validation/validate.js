const runValidators = (validators, value) => {
    for(let validator of validators){
        if(!validator(value)) return false
    }

    return true
}

export const validate = (payload, emptyInvalid = false) => {
    for(let [k, v] of Object.entries(payload)){
        if(!v.validators || (!emptyInvalid && (typeof v.value === "undefined" || v.value === "" || v.value === null)) || runValidators(v.validators, v.value)){
            payload[k].valid = true
            continue
        }
        
        payload[k].valid = false
    }
}

export const allValid = (payload, emptyInvalid = false) => {
    for(let [k, v] of Object.entries(payload)){
        if(!v.validators || (!emptyInvalid && (typeof v.value === "undefined" || v.value === "" || v.value === null)) || runValidators(v.validators, v.value)){
            continue
        }
        
        return false
    }

    return true
}
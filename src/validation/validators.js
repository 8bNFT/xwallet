export const isNumber = v => !isNaN(v)

export const isNegativeNumber = v => isNumber(v) && Number(v) < 0

export const isNegativeNumberOrZero = v => isNegativeNumber(v) || Number(v) === 0

export const isPositiveNumber = v => isNumber(v) && Number(v) > 0

export const isPositiveNumberOrZero = v => isPositiveNumber(v) || Number(v) === 0

export const isGt = (v, x) =>  Number(v) > Number(x)

export const isLt = (v, x) =>  Number(v) < Number(x)

export const isEq = (v, x) => v == x

export const isEqStrict = (v, x) => v === x

export const isNotEq = (v, x) => v != x

export const isNotEqStrict = (v, x) => v !== x

export const isGtOrEq = (v, x) => isEq(Number(v),  Number(x)) || isGt(Number(v),  Number(x))

export const isLtOrEq = (v, x) => isEq(Number(v), Number(x)) || isLt(Number(v), Number(x))

export const isEthAddress = v => /^(0x)?[0-9a-f]{40}$/i.test(v.toLowerCase())

export const isNotEmpty = v => typeof v !== "undefined" && v !== null && String(v).trim()

export const isTrue = v => v === true || v === "true"

export const isTruthy = v => v

export const isFalse = v => v === false || v === "false"

export const isFalsy = v => !v
import BigNumber from "bignumber.js"
BigNumber.set({EXPONENTIAL_AT: 25})

export const assetToUSD = (amount, price) => amount * price
export const USDToAsset = (amount, price) => price ? (amount / price) : 0

export const limitPrecision = (num, precision) => {
    const stringNum = String(num)
    if(isNaN(num) || num === "") return num

    const limited = (new BigNumber(num)).toFixed(precision, BigNumber.ROUND_DOWN)

    if((new BigNumber(limited)).eq(new BigNumber(num))){
        if(!stringNum.includes(".") || stringNum.length - stringNum.indexOf(".") - 1 <= precision) return stringNum
        return stringNum.slice(0, - 1)
    }
    return limited
}

export const parseWithDecimals = (amount, decimals, precision) => 
    (new BigNumber(amount).times(new BigNumber(Math.pow(10, parseInt('-' + decimals))))).toString(precision)
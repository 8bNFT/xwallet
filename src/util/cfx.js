import BigNumber from "bignumber.js"
BigNumber.set({EXPONENTIAL_AT: 25})

export const assetToUSD = (amount, price, precision = 2) => Math.floor((amount * price) * precision) / precision
export const USDToAsset = (amount, price) => price ? (amount / price) : 0

export const limitPrecision = (num, precision) => {
    const stringNum = String(num)
    const limited = (new BigNumber(num)).toFixed(precision, BigNumber.ROUND_DOWN)

    console.log(
        stringNum,
        limited.toString(),
        stringNum.length,
        stringNum.indexOf("."),
        stringNum.length - stringNum.indexOf(".") - 1,
        precision,
        stringNum.slice(0, - 1),
        limited.toString()
    )

    if((new BigNumber(limited)).eq(new BigNumber(num))){
        if(stringNum.length - stringNum.indexOf(".") - 1 <= precision) return stringNum
        return stringNum.slice(0, - 1)
    }
    return limited
}
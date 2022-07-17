import BigNumber from "bignumber.js"
BigNumber.set({EXPONENTIAL_AT: 25})

const fiatFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: "USD" })

export const assetToUSD = (amount, price) => limitPrecision(amount * price, 2)

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

export const formatFiatDisplay = v => fiatFormatter.format(v)

export const formatCryptoDisplay = v =>{
    const decimalSplit = v.split(".")
    const fiatFormat = formatFiatDisplay(decimalSplit[0]).split('.')[0]
    return `${v.startsWith("-") && "-" || ""}${fiatFormat.split("$")[1]}${decimalSplit[1] ? '.' : ''}${decimalSplit[1] || ""}`
}
    
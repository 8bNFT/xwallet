export const assetToUSD = (amount, price) => parseFloat((amount * price).toFixed(2))
export const USDToAsset = (amount, price) => price ? parseFloat((amount / price).toFixed(6)) : 0
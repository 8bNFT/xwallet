export const parseAssets = assets => {
    return Object.entries(assets).reduce((acc, [address, assets]) => {
        if(!assets.length) return acc
        const collection = assets[0].collection
        return [...acc, [{...collection, address}, assets]]
    }, [])
}

export const flattenAssets = assets => Object.values(assets).reduce((acc, v) => [...acc, ...v], [])
<script>
    export let formStore, onrampTokens

    import Select from "src/comps/Select.svelte";

    const balancesToOptions = (balances) => {
        const options = []
        for(const [id, value] of Object.entries(balances)){
            options.push({
                value: id,
                label: value.symbol,
                icon: value.image_url || "https://design-system.immutable.com/currency_icons/currency--erc20.svg",
                fallback_icon: "https://design-system.immutable.com/currency_icons/currency--erc20.svg"
            })
        }

        return options
    }

    const options = balancesToOptions(onrampTokens)
</script>

<Select bind:value={$formStore.coin} {options} />
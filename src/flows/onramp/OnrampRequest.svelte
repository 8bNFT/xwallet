<script>
    export let formStore, onrampTokens

    import Select from "src/comps/Select.svelte";
    import { DEFAULT_TOKEN_ICON } from "src/util/generic";

    const balancesToOptions = (balances) => {
        const options = []
        for(const [id, value] of Object.entries(balances)){
            options.push({
                value: id,
                label: value.symbol,
                icon: value.image_url || DEFAULT_TOKEN_ICON,
                fallback_icon: DEFAULT_TOKEN_ICON
            })
        }

        return options
    }

    const options = balancesToOptions(onrampTokens)
</script>

<Select bind:value={$formStore.coin} {options} />
<script>
    export let formStore, validationStore, offrampTokens

    import CfxInput from "src/comps/CfxInput.svelte";
    import Select from "src/comps/Select.svelte";
    import { tokens } from "src/stores/wallet";

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

    const options = balancesToOptions(offrampTokens)
</script>

<Select bind:value={$formStore.coin} {options} />
<div class="separator"></div>
<CfxInput {options} label={"Amount"} asset={tokens[$formStore.coin]} bind:value={$formStore.amount} valid={$validationStore.amount.valid} error={$validationStore.amount.error} />
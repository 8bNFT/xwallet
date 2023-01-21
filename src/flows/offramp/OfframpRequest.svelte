<script>
    export let formStore, validationStore, offrampTokens

    import CfxInput from "src/comps/CfxInput.svelte";
    import Select from "src/comps/Select.svelte";
    import { Wallet } from "src/stores/wallet";
    import { DEFAULT_TOKEN_ICON } from "src/util/generic";

    const { Tokens } = $Wallet

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

    const options = balancesToOptions(offrampTokens)
</script>

<Select bind:value={$formStore.coin} {options} />
<div class="separator"></div>
<CfxInput {options} label={"Amount"} asset={$Tokens[$formStore.coin]} bind:value={$formStore.amount} valid={$validationStore.amount.valid} error={$validationStore.amount.error} />
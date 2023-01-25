<script>
    export let formStore, validationStore

    import { Wallet } from "src/stores/wallet";
    import CfxInput from "src/comps/CfxInput.svelte";
    import Select from "src/comps/Select.svelte";
    import LabelButton from "src/comps/LabelButton.svelte";
    import { DEFAULT_TOKEN_ICON } from "src/util/generic";
    import EnsInput from "src/comps/ENSInput.svelte";

    const { Balances } = $Wallet

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

    const setAmount = () => {
        $formStore.amount = Number($Balances[$formStore.coin].balance.parsed)
    }
</script>

<Select bind:value={$formStore.coin} options={balancesToOptions($Balances)} />
<div class="separator"></div>
{#if $Balances}
<CfxInput bind:value={$formStore.amount} valid={$validationStore.amount.valid} error={$validationStore.amount.error} label="Amount" asset={$Balances[$formStore.coin]}>
    <LabelButton slot="label-right" value={"Max. " + $Balances[$formStore.coin].balance.parsed + " " + $Balances[$formStore.coin].symbol} on:click={setAmount} />
</CfxInput>
{/if}
<div class="separator"></div>
<EnsInput placeholder={"Receiver address"} label="Receiver" bind:value={$formStore.receiver} valid={$validationStore.receiver.valid}  error={$validationStore.receiver.error} />
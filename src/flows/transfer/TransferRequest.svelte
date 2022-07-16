<script>
    export let formStore, validationStore

    import { Balances } from "src/stores/wallet";
    import BasicInput from "src/comps/BasicInput.svelte";
    import CfxInput from "src/comps/CfxInput.svelte";
    import Select from "src/comps/Select.svelte";
    import LabelButton from "src/comps/LabelButton.svelte";

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

    const setAmount = () => {
        $formStore.amount = Number($Balances[$formStore.coin].balance.parsed)
    }
</script>

<Select bind:value={$formStore.coin} options={balancesToOptions($Balances)} />
<div class="separator"></div>
<CfxInput bind:value={$formStore.amount} valid={$validationStore.amount.valid} error={$validationStore.amount.error} label="Amount" asset={$Balances[$formStore.coin]}>
    <LabelButton slot="label-right" value={"Max. " + $Balances[$formStore.coin].balance.parsed + " " + $Balances[$formStore.coin].symbol} on:click={setAmount} />
</CfxInput>
<div class="separator"></div>
<BasicInput placeholder={"Receiver address"} label="Receiver" bind:value={$formStore.receiver} valid={$validationStore.receiver.valid}  error={$validationStore.receiver.error} />
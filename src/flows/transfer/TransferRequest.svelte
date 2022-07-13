<script>
    export let formStore, validationStore

    import { Wallet } from "src/stores/wallet";
    import BasicInput from "src/comps/BasicInput.svelte";
    import CfxInput from "src/comps/CfxInput.svelte";
    import Select from "src/comps/Select.svelte";

    const balancesToOptions = (balances) => {
        const options = []
        for(const [id, value] of Object.entries(balances)){
            options.push({
                value: id,
                label: value.symbol,
                icon: value.image_url || "https://design-system.immutable.com/currency_icons/currency--erc20.svg"
            })
        }

        return options
    }

    $: Balances = $Wallet.Balances
</script>

<Select bind:value={$formStore.coin.value} options={balancesToOptions($Balances)} />
<div class="separator"></div>
<CfxInput placeholder={"Amount to send"} bind:value={$formStore.amount.value} valid={$validationStore.amount.valid} error={$validationStore.amount.error} label="Amount" asset={$Balances[$formStore.coin.value]} />
<div class="separator"></div>
<BasicInput placeholder={"Receiver address"} label="Receiver" bind:value={$formStore.receiver.value} valid={$validationStore.receiver.valid}  error={$validationStore.receiver.error} />
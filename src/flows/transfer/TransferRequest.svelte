<script>
    export let formStore

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

<div>
    <CfxInput placeholder={"Amount to send"} bind:value={$formStore.amount.value} valid={$formStore.amount.valid} label="Amount" asset={$Balances[$formStore.coin.value]} />
</div>
<div><BasicInput placeholder={"Receiver address"} label="Receiver" bind:value={$formStore.receiver.value} valid={$formStore.receiver.valid} /></div>

<style>
    div {
        margin-top: 1rem
    }

    /* temp select */
    select {
        border: 2px solid var(--l-grey);
        border-radius: 8px;
        padding: 20px .35rem;
        font-size: 1rem;
        outline-color: var(--accent);
    }
</style>
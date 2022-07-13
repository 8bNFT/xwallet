<script>
    export let formStore

    import { Wallet } from "src/stores/wallet";
    import BasicInput from "src/comps/BasicInput.svelte";
    import CfxInput from "src/comps/CfxInput.svelte";

    $: Balances = $Wallet.Balances
</script>

<select bind:value={$formStore.coin.value}>
    {#each Object.entries($Balances) as [id, coin]}
        <option value={id}>{coin.symbol}</option>
    {/each}
</select>

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
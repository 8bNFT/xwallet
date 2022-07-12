<script>
    export let formStore

    import BasicInput from "src/comps/BasicInput.svelte";
    import CfxInput from "src/comps/CfxInput.svelte";
</script>

<div><CfxInput placeholder={"Amount to send"} bind:value={formStore.amount} label="Amount" /></div>
<div><BasicInput placeholder={"Receiver address"} label="Receiver" bind:value={formStore.value} /></div>


<style>
    div {
        margin-top: 1rem
    }
</style>
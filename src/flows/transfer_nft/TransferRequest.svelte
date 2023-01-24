<script>
    import BasicInput from "src/comps/BasicInput.svelte";
    import NftTransferSummary from "src/comps/NftTransferSummary.svelte";

    export let formStore, validationStore, assets, assetStore
</script>

<BasicInput placeholder={"Receiver address"} label="Receiver" bind:value={$formStore.receiver} valid={$validationStore.receiver.valid}  error={$validationStore.receiver.error} />
<!-- <div class="separator"></div> -->
<div class="height scrollbar--thin">
    {#each assets as [collection, nfts] (collection.address)}
        <NftTransferSummary {collection} assets={nfts} {assetStore} />
    {/each}
</div>


<style>
    .height {
        max-height: 240px;
        overflow: auto;
        margin-top: 1rem
    }
</style>
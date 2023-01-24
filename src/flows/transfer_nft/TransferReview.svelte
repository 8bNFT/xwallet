<script>
    export let formStore, assets

    import BasicInfo from "src/comps/BasicInfo.svelte";
    import NftTransferSummary from "src/comps/NftTransferSummary.svelte";
    import { Wallet } from "src/stores/wallet";
    import { sliceAddress } from "src/util/generic";

    const { User } = $Wallet
</script>

<BasicInfo label={"Sender"} dataTooltip={$User.address} data={sliceAddress($User.address)} />
<div class="separator"></div>
<BasicInfo label={"Receiver"} dataTooltip={$formStore.receiver} data={sliceAddress($formStore.receiver)} />
<div class="height scrollbar--thin">
    {#each assets as [collection, nfts] (collection.address)}
        <NftTransferSummary {collection} assets={nfts} />
    {/each}
</div>


<style>
    .height {
        max-height: 240px;
        overflow: auto;
        margin-top: 1rem
    }
</style>
<script>
    import { FlowStore } from "src/stores/flows";
    import { createNftTransferStore } from "src/stores/select";
    import { createNFTStore, Wallet } from "src/stores/wallet";
    import { ASSET_STATUS_NAMES } from "src/util/imx";
    import SelectableNftGrid from "src/comps/nfts/SelectableNFTGrid.svelte";
    import Selectable from "src/comps/Selectable.svelte";
    import NftGridSkeleton from "src/comps/skeleton/NFTGridSkeleton.svelte";
    import Tabs from "src/comps/Tabs.svelte";
    import Title from "src/comps/Title.svelte";
    import Toolbar from "src/comps/Toolbar.svelte";

    const { User } = $Wallet
    const NFTStore = createNFTStore(User)
    const SelectStore = createNftTransferStore()
    
    let selectable = false
    let length = 0
    let collections = 0
    let currentOption = Object.values(ASSET_STATUS_NAMES)[0]

    const selectAll = () => $NFTStore[currentOption].forEach(token => SelectStore.select(token))

    const keyCombo = e => {
        if(!e.ctrlKey) return
        if(["a", "d"].includes(e.key)) e.preventDefault()
        if(e.key === "a") selectAll()
        if(e.key === "d") SelectStore.reset()
    }

    $: NFTStore.fetch(currentOption)
    $: length = SelectStore.length(), $SelectStore
    $: collections = Object.entries($SelectStore).filter(([k, v]) => v.length).length

    const transferNFTs = () => {
        selectable = false
        FlowStore.transferNFTs(SelectStore) // returns a promise we can await
    }
</script>

<svelte:body on:keydown={selectable ? keyCombo : null} />

{#if selectable}
    <Toolbar primaryAction={{ text: "Transfer tokens", disabled: !selectable || ($SelectStore && !SelectStore.length()), action: transferNFTs }} secondaryAction={{ text: "Cancel", action: () => (SelectStore.reset(), selectable = false) }}>
        Transfer {length} {length === 1 ? "token" : "tokens"} from {collections} {collections === 1 ? "collection" : "collections"}
    </Toolbar>
{/if}

<Title noMargin={true} title="NFT inventory" />

<Selectable enabled={selectable} targetsQuery=".grid .token" on:select={({ detail: { element, index }}) => SelectStore.select($NFTStore[currentOption][index])} on:deselect={({ detail: { element, index }}) => SelectStore.deselect($NFTStore[currentOption][index])}>
    <div class="tabs">
        <Tabs bind:currentOption options={ASSET_STATUS_NAMES} />
    </div>

    {#if $User &&!$NFTStore[currentOption]}
        <NftGridSkeleton items={8} />
    {:else}
        <SelectableNftGrid bind:selectable nfts={NFTStore && $NFTStore[currentOption] || []} store={SelectStore} status={currentOption} />
    {/if}
</Selectable>

<style>
    .title {
        margin-top: .83em
    }

    .tabs {
        margin-bottom: 1rem
    }
</style>
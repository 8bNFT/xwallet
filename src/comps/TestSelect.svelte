<script>
    import { createNftTransferStore } from "src/stores/select";
    import { fetchNFTs } from "src/util/api";
    import { DEFAULT_COLLECTION_ICON, DEFAULT_NFT_IMAGE } from "src/util/generic";
    import Selectable from "./Selectable.svelte";

    const store = createNftTransferStore()

    let edit = true
    let length = 0

    const NFTPromise = fetchNFTs()

    const selectAll = () => NFTPromise.then(({ result }) => result.forEach(token => store.select({ address: token.token_address, id: token.token_id })))

    const keyCombo = e => {
        if(!e.ctrlKey) return
        if(["a", "d"].includes(e.key)) e.preventDefault()
        if(e.key === "a") selectAll()
        if(e.key === "d") store.reset()
    }

    $: length = store.length(), $store
</script>

<svelte:body on:keydown={edit ? keyCombo : null} />

<button on:click={() => edit = !edit}>Toggle edit ({edit})</button>

{#if length}
    <span>Transfer {length} {length === 1 ? "token" : "tokens"}</span>
    <button on:click={store.reset}>Clear selection</button>
{/if}

<Selectable enabled={edit} targetsQuery=".grid .token" on:select={({ detail: { element: { dataset }}}) => store.select(dataset)} on:deselect={({ detail: { element: { dataset }}}) => store.deselect(dataset)}>
    <div class="grid">
        {#await NFTPromise}
            Loading NFTs
        {:then { result }}
            {#each result as nft}
                <div class="token" data-address={nft.token_address} data-id={nft.token_id} class:selected={edit && nft.token_address in $store && $store[nft.token_address].has(String(nft.token_id))} class:selectable={edit} on:click={edit ? () => store.toggle({ address: nft.token_address, id: nft.token_id }) : null}>
                    <div class="image">
                        <img src={nft.image_url || DEFAULT_NFT_IMAGE} on:error={e => e.target.src = DEFAULT_NFT_IMAGE} />
                    </div>
                    <div class="collection">
                        <!-- <div class="collection_icon">
                            <img src={nft.collection.icon_url || DEFAULT_COLLECTION_ICON} on:error={e => e.target.src = DEFAULT_COLLECTION_ICON} />
                        </div> -->
                        <div class="collection_name">{nft.collection.name}</div>
                    </div>
                    <div class="name">{nft.name}</div>
                    <div class="id">{nft.token_id}</div>
                </div>
            {/each}
        {/await}
    </div>
</Selectable>

<style>
    .grid {
        padding-top: 8px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
    }

    .token {
        border: 2px solid transparent;
        border-radius: .5rem;
        transition: all 0.15s;
        padding: .75rem;
        padding-bottom: 1rem;
        box-shadow: 0 0 12px rgba(0, 0, 0, .1);
    }

    .token.selectable {
        cursor: pointer;
        transform: translateY(-4px);
        box-shadow: 0 0 16px rgba(0, 0, 0, .04);
    }

    .token.selectable:not(.selected):hover {
        transform: translateY(-8px);
        box-shadow: 0 0 24px rgba(0, 0, 0, .02);
    }

    .token.selected {
        border-color: var(--accent);
        background-color: #f9fbff
    }

    .token img {
        max-width: 100%;
        object-fit: contain;
        pointer-events: none;
        user-select: none;
    }

    .image {
        width: 100%;
        margin-bottom: .85rem;
        aspect-ratio: 1 / 1;
    }

    .image img {
        height: 100%;
        width: 100%;
    }

    .id {
        font-size: .75rem;
    }

    .collection {
        display: flex;
        align-items: center;
        font-size: .75rem;
    }

    .collection_name, .id {
        color: var(--grey);
    }

    .collection_icon {
        width: 1.25em;
        height: 1.25em;
        margin-right: .25rem;
        border-radius: 50%;
        overflow: hidden;
    }

    .name {
        margin: .25rem 0;
        font-size: .9rem;
    }
</style>
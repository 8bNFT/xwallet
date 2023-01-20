<script>
    import { ctxMenu } from "src/stores/generics";
    import { createNftTransferStore } from "src/stores/select";
    import { fetchNFTs } from "src/util/api";
    import { DEFAULT_NFT_IMAGE } from "src/util/generic";
    import { ASSET_STATUS_NAMES } from "src/util/imx";
    import Selectable from "./Selectable.svelte";
    import Submenu from "./Submenu.svelte";
    import Tabs from "./Tabs.svelte";
    import Toolbar from "./Toolbar.svelte";

    const store = createNftTransferStore()

    let edit = false
    let length = 0
    let collections = 0

    const NFTPromise = fetchNFTs()

    const selectAll = () => NFTPromise.then(({ result }) => result.forEach(token => store.select({ address: token.token_address, id: token.token_id })))

    const keyCombo = e => {
        if(!e.ctrlKey) return
        if(["a", "d"].includes(e.key)) e.preventDefault()
        if(e.key === "a") selectAll()
        if(e.key === "d") store.reset()
    }

    $: length = store.length(), $store
    $: collections = Object.entries($store).filter(([k, v]) => v.size).length

    let currentOption = Object.keys(ASSET_STATUS_NAMES)[0]

    const openContextMenu = e => {
        const target = e.target
        const bounding = target.getBoundingClientRect()

        $ctxMenu = { top: bounding.bottom + 8, left: bounding.left }
    }

    const createOptions = token => {
        const options = [
            { text: "Transfer token", action: () => initTransferSelect(token) },
            { text: "Withdraw token", action: () => initTransferSelect(token) },
            { text: "View on Immutascan", action: () => window.open(`https://immutascan.io/address/${token.token_address}/${token.token_id}`, "_blank") },
        ]
        return options
    }

    let submenuTarget, options

    const initTransferSelect = token => {
        store.reset()
        store.select({ address: token.token_address, id: token.token_id })
        edit = true
    }

    const openSubmenu = (e, token) => {
        const { target } = e
        if(submenuTarget === target) return submenuTarget = false

        options = createOptions(token)
        submenuTarget = target
    }
</script>

<svelte:body on:keydown={edit ? keyCombo : null} />

<!-- <button on:click={() => edit = !edit}>Toggle edit ({edit})</button> -->

<!-- {#if length}
    <span>Transfer {length} {length === 1 ? "token" : "tokens"}</span>
    <button on:click={store.reset}>Clear selection</button>
{/if} -->

<!-- {ASSET_STATUS_NAMES[currentOption]} -->

<Submenu bind:target={submenuTarget} {options} />

{#if edit}
    <Toolbar primaryAction={{ text: "Transfer tokens", disabled: !edit, action: () => edit = !edit }} secondaryAction={{ text: "Cancel", action: () => (store.reset(), edit = false) }}>
        Transfer {length} {length === 1 ? "token" : "tokens"} from {collections} {collections === 1 ? "collection" : "collections"}
    </Toolbar>
{/if}

<Selectable enabled={edit} targetsQuery=".grid .token" on:select={({ detail: { element: { dataset }}}) => store.select(dataset)} on:deselect={({ detail: { element: { dataset }}}) => store.deselect(dataset)}>
    <div class="tabs">
        <Tabs bind:currentOption options={Object.keys(ASSET_STATUS_NAMES)} />
    </div>
    <div class="grid">
        {#await NFTPromise}
            Loading NFTs
        {:then { result }}
            {#each result as nft}
                <div class="token" data-address={nft.token_address} data-id={nft.token_id} class:selected={edit && nft.token_address in $store && $store[nft.token_address].has(String(nft.token_id))} class:selectable={edit} on:click={edit ? () => store.toggle({ address: nft.token_address, id: nft.token_id }) : null}>
                    {#if !edit}
                        <button on:click={e => openSubmenu(e, nft) }>
                            Toggle
                        </button>
                    {/if}
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

        <!-- <div class="submenu" style={`left: ${$ctxMenu.left}px; top: ${$ctxMenu.top}px`}>
            <div>
                <div>Transfer token</div>
                <div>Withdraw token</div>
            </div>
        </div> -->
    </div>
</Selectable>

<style>
    button {
        position: absolute;
        /* right: .5rem; */
        /* top: .5rem; */
        /* background: red */
    }

    .tabs {
        /* margin-top: .75rem; */
        margin-bottom: 1rem
    }

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

    .name {
        margin: .25rem 0;
        font-size: .9rem;
    }
</style>
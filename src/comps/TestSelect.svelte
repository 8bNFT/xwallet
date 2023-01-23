<script>
    import { ctxMenu, FlowStore } from "src/stores/generics";
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
    let assets

    const NFTPromise = (async () => {
        assets = (await fetchNFTs()).result
        return assets
    })()

    const selectAll = () => NFTPromise.then((result) => result.forEach(token => store.select(token)))

    const keyCombo = e => {
        if(!e.ctrlKey) return
        if(["a", "d"].includes(e.key)) e.preventDefault()
        if(e.key === "a") selectAll()
        if(e.key === "d") store.reset()
    }

    $: length = store.length(), $store
    $: collections = Object.entries($store).filter(([k, v]) => v.length).length

    let currentOption = Object.keys(ASSET_STATUS_NAMES)[0]

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
        store.select(token)
        edit = true
    }

    const openSubmenu = (e, token) => {
        const { target } = e
        if(submenuTarget === target) return submenuTarget = false

        options = createOptions(token)
        submenuTarget = target
    }

    const getSelectedNFT = () => {
        const nft = Object.entries($store).filter(([k, v]) => v.size)[0]
        const [ address, token ] = [nft[0], Array.from(nft[1])[0]]
        return token
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
    <Toolbar primaryAction={{ text: "Transfer tokens", disabled: !edit, action: () => FlowStore.depositNFT() }} secondaryAction={{ text: "Cancel", action: () => (store.reset(), edit = false) }}>
        Transfer {length} {length === 1 ? "token" : "tokens"} from {collections} {collections === 1 ? "collection" : "collections"}
    </Toolbar>
{/if}

<Selectable enabled={edit} targetsQuery=".grid .token" on:select={({ detail: { element, index }}) => store.select(assets[index])} on:deselect={({ detail: { element, index }}) => store.deselect(assets[index])}>
    <div class="tabs">
        <Tabs bind:currentOption options={Object.keys(ASSET_STATUS_NAMES)} />
    </div>
    <div class="grid">
        {#await NFTPromise}
            Loading NFTs
        {:then result}
            {#each result as nft}
                <div class="token" data-token={JSON.stringify(nft)} class:selected={edit && nft.token_address in $store && store.contains(nft)} class:selectable={edit} on:click={edit ? () => store.toggle(nft) : null}>
                    {#if !edit}
                        <button class="toggle" on:click={e => openSubmenu(e, nft) }>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                              </svg>
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
    .toggle {
        display: block;
        padding: 6px 4px;
        background: rgba(255, 255, 255, .7);
        backdrop-filter: blur(15px);
        border: none;
        border-radius: 4px;
        bottom: 1rem;
        right: .75rem;
        transition: all .15s;
        color: var(--grey);
        cursor: pointer;
        opacity: 0;
    }

    .token:hover .toggle {
        opacity: 1
    }

    .toggle:hover {
        background: var(--l-grey);
        color: black
    }

    .toggle svg {
        /* width: 20px; */
        height: 20px;
        width: 20px;
    }

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
        position: relative;
        border: 2px solid var(--l-grey);
        border-radius: .5rem;
        transition: all 0.15s;
        padding: .75rem;
        padding-bottom: 1rem;
        /* box-shadow: 0 0 12px rgba(0, 0, 0, .1); */
    }

    .token.selectable {
        cursor: pointer;
        transform: translateY(-4px);
        border-color: transparent;
        box-shadow: 0 0 16px rgba(0, 0, 0, .04);
    }

    /* .token.selectable img {
        filter: opacity(0.5)
    } */

    .token.selectable:not(.selected):hover {
        transform: translateY(-8px);
        box-shadow: 0 0 24px rgba(0, 0, 0, .02);
    }

    .token.selected {
        border-color: var(--accent);
        background-color: #f9fbff
    }

    .token.selected img {
        filter: none
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
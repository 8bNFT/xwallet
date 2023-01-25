<script>
    export let nft, selected, selectable

    import { createEventDispatcher } from 'svelte';
    import { DEFAULT_NFT_IMAGE } from 'src/util/generic';

    const dispatch = createEventDispatcher();
    const onToggle = e => dispatch('toggle', { target: e.target, nft })
</script>

<div class="token" on:click class:selected class:selectable>
    {#if !selectable}
        <button class="toggle" on:click={onToggle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
              </svg>
        </button>
    {/if}
    <div class="image">
        <img src={nft.image_url || DEFAULT_NFT_IMAGE} on:error={e => e.target.src = DEFAULT_NFT_IMAGE} />
    </div>
    <div class="collection">
        <div class="collection_name">{nft.collection.name}</div>
    </div>
    <div class="name">{nft.name}</div>
    <div class="id">{nft.token_id}</div>
</div>

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
        position: absolute;
    }

    .token:hover .toggle {
        opacity: 1
    }

    .toggle:hover {
        background: var(--l-grey);
        color: black
    }

    .toggle svg {
        height: 20px;
        width: 20px;
    }

    .token {
        position: relative;
        border: 2px solid var(--l-grey);
        border-radius: .5rem;
        transition: all 0.15s;
        padding: .75rem;
        padding-bottom: 1rem;
    }

    .token.selectable {
        cursor: pointer;
        transform: translateY(-4px);
        border-color: transparent;
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

    .token.selected img {
        filter: none
    }

    .token img {
        max-width: 100%;
        object-fit: contain;
        pointer-events: none;
        user-select: none
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
<script>
    export let collection, assets, assetStore

    import Tooltip from "src/comps/Tooltip.svelte";

    let toggled = false
</script>

<div class="collection">
    <div class="image" on:click={() => toggled = !toggled}>
        <img src={collection.icon_url} />
    </div>
    <div class="info">
        <div on:click={() => toggled = !toggled} class="collection__name">
            {collection.name}
        </div>
        {#if toggled}
            <div class="tokens">
                {#each assets as asset (`${asset.token_id + "|" + asset.token_address}`)}
                    <div class="token">
                        <div class="circle">
                            <img src={asset.image_url} />
                        </div>
                        <div>
                            <div class="token__name">
                                {asset.name}
                                {#if assetStore}
                                    <span class="remove" on:click|stopPropagation={() => assetStore.deselect(asset)}>Remove</span>
                                {/if}
                            </div>
                            <div class="token__id">
                                {asset.token_id}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div on:click={() => toggled = !toggled} class="circles">
                {#each assets.slice(0, 5) as asset}
                    <div class="circle">
                        <Tooltip title={`${asset.name} (${asset.token_id})`}>
                            <img src={asset.image_url} />
                        </Tooltip>
                    </div>
                {/each}
                {#if assets.length - 5 > 0}
                    <div class="circle">
                        <Tooltip title={`${assets.length} total`}>
                            +{assets.length - 5}
                        </Tooltip>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    .collection {
        padding: .75rem;
        background: var(--l-grey);
        display: flex;
        align-items: flex-start;
        border-radius: 8px;
        /* cursor: pointer; */
        transition: background-color .15s
    }

    .collection:hover {
        background: #e9e9e9;
    }

    .collection:active {
        background: #e2e2e2;
    }

    .collection:not(:first-child) {
        margin-top: 1rem
    }

    .image {
        width: 3.5rem;
        height: 3.5rem;
        margin-right: 1rem;
        border-radius: 4px;
        background: white;
        border: 4px solid white;
        flex-shrink: 0;
        cursor: pointer
    }

    .image img {
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
        display: block
    }

    .circle {
        height: 2rem;
        width: 2rem;
        border-radius: 5rem;
        overflow: hidden;
        border: 2px solid white;
        background-color: white;
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
        font-size: .7em;
        font-weight: 700;
    }

    .collection__name {
        font-weight: 500;
        margin-bottom: .25rem;
        font-size: .95em;
        cursor: pointer
    }

    .circle:not(:first-child) {
        margin-left: -0.75rem
    }

    .circle img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        display: block
    }

    .circles {
        display: flex;
        cursor: pointer
    }

    .token {
        display: flex;
        align-items: flex-start;
        margin-bottom: .5rem
    }

    .token .circle {
        margin: 0;
        margin-right: .25rem
    }

    .remove {
        flex-shrink: 0;
        text-transform: uppercase;
        margin-left: .5rem;
        font-size: .7em;
        font-weight: 600;
        color: var(--grey);
        transition: all .15s;
        cursor: pointer;
        opacity: 0;
    }

    .remove:hover {
        color: rgb(194, 3, 3);
    }

    .token:hover .remove {
        opacity: 1
    }

    .token__name {
        font-size: .9em;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }

    .token__id {
        font-size: .9em;
        color: var(--grey)
    }
</style>
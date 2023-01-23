<script>
    export let asset

    import Tooltip from "src/comps/Tooltip.svelte"
    import { copyToClipboard } from "src/util/generic";
</script>

<div class="holder">
    <div class="image">
        <img src={asset.image_url} />
    </div>
    <div class="info">
        <div class="collection" on:click={() => copyToClipboard(asset.token_address, "collection address")}>
            <Tooltip title={asset.token_address}>
                {asset.collection.name}
            </Tooltip>
        </div>
        <div class="name">
            {asset.name}
        </div>
        <div class="id">
            {asset.token_id}
        </div>
    </div>
</div>

<style>
    .holder {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .image {
        max-width: min(50%, 150px)
    }

    .image img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain
    }

    .collection {
        cursor: pointer;
        font-size: .9rem;
        color: var(--grey);
        margin-top: 1.5rem;
        margin-bottom: .5rem;
    }

    .name {
        font-weight: 500;
        /* font-size: .95rem */
    }

    .id {
        color: var(--grey);
        font-size: .95rem;
        margin-top: .25rem
    }
</style>
<script>
    export let token

    import Tooltip from "src/comps/Tooltip.svelte"
    import { copyToClipboard } from "src/util/generic";
</script>

<div class="holder">
    {#if token.status === "imx"}
        <div class="warning">Once you start a withdrawal it <b>can't be cancelled.</b><br/>This step can take between 24 - 48 hours.</div>
        <div class="separator"></div>
    {/if}
    <div class="image">
        <img src={token.image_url} />
    </div>
    <div class="info">
        <div class="collection" on:click={() => copyToClipboard(token.token_address, "collection address")}>
            <Tooltip title={token.token_address}>
                {token.collection.name}
            </Tooltip>
        </div>
        <div class="name">
            {token.name}
        </div>
        <div class="id">
            {token.token_id}
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
        height: 150px;
        width: 150px;
        background: var(--l-grey);
        border-radius: 6px;
        overflow: hidden;
        border: 4px solid white;
        box-shadow: 0 0 30px rgba(0, 0, 0, .05);
    }

    .image img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
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

    .warning {
        font-size: .8rem;
        color: var(--grey);
        line-height: 1.35em;
    }

    .warning b {
        color: black;
        font-weight: 600
    }
</style>
<script>
    import BasicInput from "src/comps/BasicInput.svelte";
    import Tooltip from "src/comps/Tooltip.svelte";

    export let formStore, validationStore, assets
</script>

<BasicInput placeholder={"Receiver address"} label="Receiver" bind:value={$formStore.receiver} valid={$validationStore.receiver.valid}  error={$validationStore.receiver.error} />
<!-- <div class="separator"></div> -->
<div class="height scrollbar--thin">
    {#each assets as [collection, nfts]}
        <div class="collection">
            <div class="image">
                <img src={collection.icon_url} />
            </div>
            <div class="info">
                <div class="name">
                    {collection.name}
                </div>
                <div class="tokens">
                    {#each nfts.slice(0, 5) as nft}
                        <div class="circle">
                            <Tooltip title={`${nft.name} (${nft.token_id})`}>
                                <img src={nft.image_url} />
                            </Tooltip>
                        </div>
                    {/each}
                    {#if nfts.length - 5 > 0}
                        <div class="circle">
                            <Tooltip title={`${nfts.length} total`}>
                                +{nfts.length - 5}
                            </Tooltip>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    {/each}
</div>


<style>
    .height {
        max-height: 240px;
        overflow: auto;
        margin-top: 1rem
    }

    .collection {
        padding: .75rem;
        background: var(--l-grey);
        display: flex;
        align-items: center;
        border-radius: 8px
    }

    .collection:not(:first-child) {
        margin-top: 1rem
    }

    .image {
        /* aspect-ratio: 1 / 1; */
        width: 3.5rem;
        height: 3.5rem;
        margin-right: 1rem;
        border-radius: 4px;
        background: white;
        border: 4px solid white
    }

    .image img {
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
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

    .name {
        font-weight: 500;
        margin-bottom: .25rem;
        font-size: .95em;
    }

    .circle:not(:first-child) {
        margin-left: -0.75rem
    }

    .circle img {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }

    .tokens {
        display: flex;
    }
</style>
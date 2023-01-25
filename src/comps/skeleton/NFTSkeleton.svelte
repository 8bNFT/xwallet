<script>
    import Text from "./Text.svelte";
    import Image from "./Image.svelte";
</script>
<div class="token">
    <div class="image">
        <Image h={"100%"} w={"100%"} />
    </div>
    <div class="collection">
        <div class="collection_name">
            <Text />
        </div>
    </div>
    <div class="name"><Text /></div>
    <div class="id"><Text /></div>
</div>

<style>
    .token {
        position: relative;
        border: 2px solid var(--l-grey);
        border-radius: .5rem;
        transition: all 0.15s;
        padding: .75rem;
        padding-bottom: 1rem;
    }

    .image {
        width: 100%;
        margin-bottom: .85rem;
        aspect-ratio: 1 / 1;
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
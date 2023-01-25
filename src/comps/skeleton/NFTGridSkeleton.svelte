<script>
    export let items = 8
    
    import NftSkeleton from "./NFTSkeleton.svelte";
</script>
<div class="grid">
    {#each new Array(items) as _}
        <NftSkeleton />
    {/each}
</div>

<style>
    .grid {
        padding-top: 8px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
    }
</style>
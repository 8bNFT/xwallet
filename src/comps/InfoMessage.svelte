<script>
    export let info

    import { fade } from "svelte/transition"
</script>

{#if info}
    <div transition:fade={{duration: 150}}>
        {info}
    </div>
{/if}


<style>
    div {
        margin-top: .3rem;
        font-size: .8rem;
        color: var(--grey);
    }
</style>
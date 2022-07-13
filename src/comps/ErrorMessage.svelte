<script>
    export let error

    import { fade } from "svelte/transition"
</script>

{#if error}
    <div transition:fade={{duration: 150}}>
        {error}
    </div>
{/if}


<style>
    div {
        margin-top: .3rem;
        font-size: .8rem;
        color: #ff1515;
    }
</style>
<script>
    export let value, disabled

    import { createEventDispatcher } from 'svelte';

    const emit = createEventDispatcher()
</script>

<button on:click={() => emit('click', {})} {disabled}>
    {value}
</button>

<style>
    button {
        color: inherit;
        font-size: 1em;
        border: none;
        padding: none;
        outline: none;
        transition: color .15s;
        background: none;
        cursor: pointer
    }

    button:hover:not([disabled]) {
        color: var(--accent)
    }
</style>
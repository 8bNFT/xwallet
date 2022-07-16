<script>
    export let value, disabled
</script>

<button on:click {disabled}>
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
<script>
    export let action, text, type = "primary", disabled = false, small = false
</script>

<button class={type === "secondary" ? "secondary" : "primary"} class:small on:click={action} {disabled}>{text}</button>

<style>
    button {
        border: none;
        outline: none;
        font-size: .95rem;
        cursor: pointer;
        transition: background .2s, opacity .2s, color .2s;
        border-radius: 8px;
    }

    button[disabled] {
        cursor: not-allowed
    }

    button.primary {
        background: var(--accent);
        color: white;
        padding: 14px 32px;
    }

    button.primary[disabled] {
        background: var(--l-grey) !important;
        color: var(--grey) !important;
    }

    button.primary:hover {
        background: var(--d-accent)
    }

    button.secondary {
        background: none;
        color: var(--grey);
        padding: 16px 24px;
        opacity: .8;
    }

    button.secondary[disabled] {
        opacity: .6 !important;
        background: none !important;
    }

    button.secondary:hover {
        opacity: 1;
        color: black
    }

    button.small.secondary:hover {
        background: rgb(250, 250, 250);
    }

    button.small.secondary:active {
        background: var(--l-grey);
    }

    button.small {
        padding: 12px 24px;
        border-radius: 6px;
        font-size: .85rem
    }
</style>
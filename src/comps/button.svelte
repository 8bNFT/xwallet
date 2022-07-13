<script>
    export let action, text, type = "primary", disabled = false 
</script>

<button class={type === "secondary" ? "secondary" : "primary"} on:click={action} {disabled}>{text}</button>

<style>
    button {
        border: none;
        outline: none;
        font-size: 1rem;
        cursor: pointer;
        transition: background .2s, opacity .2s, color .2s
    }

    button[disabled] {
        cursor: not-allowed
    }

    button.primary {
        background: var(--accent);
        color: white;
        border-radius: 14px;
        padding: 24px 48px;
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
    }

    button.secondary:hover {
        opacity: 1;
        color: var(--d-grey)
    }
</style>
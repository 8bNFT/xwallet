<script>
    export let value, disabled, big, resetMargin

    import { EVENT_ICONS } from "src/util/generic";
</script>

<button {disabled} class:big on:click>
    <span class="icon" class:resetMargin>
        {@html EVENT_ICONS[value.toLowerCase()]}
    </span>
    {#if big !== true}
        <span class="value">
            {value}
        </span>
    {/if}
</button>

<style>
    button {
        padding: 0;
        background: 0;
        outline: 0;
        border: 0;
        display: inline-flex;
        margin-right: auto;
        align-items: center;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
    }

    .icon {
        background: var(--accent);
        display: inline-flex;
        height: 1.75em;
        width: 1.75em;
        align-items: center;
        justify-content: center;
        margin-right: .5em;
        border-radius: 50%;
        transition: background-color .2s;
        color: white
    }

    .icon.resetMargin { margin: 0 }

    .big .icon {
        height: 2.5rem;
        width: 2.5rem;
    }

    button[disabled] .icon {
        background: var(--grey) !important
    }

    button[disabled] {
        cursor: not-allowed
    }

    button[disabled] .value {
        opacity: 1 !important
    }

    button:hover .icon {
        background: #052da3
    }

    .value {
        opacity: 1;
        transition: opacity .2s
    }

    button:hover .value {
        opacity: .8
    }

    :global(.icon svg.bigger) {
        height: 50%;
        width: 50%;
    }

    :global(.icon svg) {
        height: 40%;
        width: 40%;
    }
</style>
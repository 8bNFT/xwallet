<script>
    export let options, currentOption

    $: typeof currentOption === "undefined" ? currentOption = options.length ? options[0] : undefined : null
</script>

<div class="tabs">
    {#each options as option}
        <div class="tab" class:active={currentOption === option} on:click={() => currentOption = option}>{option}</div>
    {/each}
</div>

<style>
    .tabs {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }

    .tab {
        margin-top: .75rem;
        color: black;
        cursor: pointer;
        font-size: .9rem;
        padding: .5rem 1rem;
        flex-shrink: 0;
        border: 2px solid var(--l-grey);
        background: var(--l-grey);
        margin-right: .75rem;
        border-radius: 2rem;
        font-weight: 500;
        transition: all .15s;
        user-select: none;
    }

    .tab:not(.active):hover {
        transform: translateY(-2px);
    }

    .tab.active {
        color: white;
        background: black;
        box-shadow: 0px 0px 30px rgba(0, 0, 0, .06);
        /* border-color: var(--accent) */
    }
</style>
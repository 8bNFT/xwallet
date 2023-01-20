<script>
    import { tick } from "svelte";


    export let target, options = {}

    let container
    let open = false
    let style = ""

    const checkIfOutside = e => e.target !== target ? target = undefined : null

    const calculatePosition = async () => {
        await tick()
        if(!target || !container) return
        const rect = target.getBoundingClientRect()
        style = `top: ${rect.bottom + 10}px; left: ${rect.left}px`
    }

    $: if(target) (calculatePosition())
</script>

<svelte:window on:click={checkIfOutside} on:scroll={calculatePosition} on:resize={calculatePosition} />

{#if target}
    <div bind:this={container} class="holder" {style}>
        {#each options as option}
            <div on:click={option.action}>{option.text}</div>
        {/each}
    </div>
{/if}

<style>
    .holder {
        position: fixed;
        background: white;
        padding: .5rem;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, .06);
        border-radius: 6px
    }

    .holder div {
        padding: .6rem .5rem;
        font-size: .9rem;
        cursor: pointer;
        transition: all .25s;
        border-radius: 3px;
    }

    .holder div:hover {
        background: var(--l-grey)
    }
</style>
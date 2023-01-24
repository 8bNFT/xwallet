<script>
    import { tick } from "svelte";

    export let target, options = {}

    let container
    let style = ""

    const checkIfOutside = e => e.target !== target ? target = undefined : null

    const calculatePosition = async () => {
        await tick()
        if(!target || !container) return
        const rect = target.getBoundingClientRect()
        const xaxis = rect.left + container.clientWidth > window.innerWidth ? rect.right - container.clientWidth : rect.left
        style = `top: ${rect.bottom + 10}px; left: ${xaxis}px`
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
        background: rgba(255, 255, 255, .75);
        backdrop-filter: blur(15px);
        padding: .5rem;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, .06);
        border-radius: 6px;
        z-index: 99999;
    }

    .holder div {
        padding: .75rem;
        font-size: .8rem;
        font-weight: 500;
        cursor: pointer;
        transition: all .25s;
        border-radius: 3px;
    }

    .holder div:hover {
        background: rgb(248, 248, 248)
    }
</style>
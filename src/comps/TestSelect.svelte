<script>
    import { createNftTransferStore } from "src/stores/select";

    const store = createNftTransferStore()

    let edit = true
    let length = 0

    const nfts = {
        "0x0": [1, 2, 3, 4, 5, 6],
        "0x1": [1, 2, 3, 4, 5, 6, 90, 91]
    }

    const toggleSelect = token => {
        if(store.contains(token)) return store.deselect(token)
        store.select(token)
    }

    $: length = store.length(), $store
</script>

<button on:click={() => edit = !edit}>Toggle edit ({edit})</button>

{#if length}
    <span>Transfer {length} {length === 1 ? "token" : "tokens"}</span>
{/if}

<div class="grid">
    {#each Object.entries(nfts) as [address, ids]}
        {#each ids as id}
            <div class="token" class:selected={edit && address in $store && $store[address].has(String(id))} class:selectable={edit} on:click={edit ? () => toggleSelect({ address, id }) : undefined}>
                This is a cool token {address} id {id}
            </div>
        {/each}
    {/each}
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: .5rem;
    }

    .token {
        border: 2px solid transparent;
        transition: all 0.15s;
        padding: 1rem .2rem
    }

    .token.selectable:hover {
        background: rgba(0, 0, 255, .02)
    }

    .token.selectable:not(.selected):hover {
        border-color: lightblue
    }

    .token.selected {
        border-color: blue
    }
</style>
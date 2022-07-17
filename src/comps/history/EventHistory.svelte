<script>
    import { createGenericStore } from "src/stores/generics";
    import { Wallet, User } from "src/stores/wallet";
    import { getEventHistoryProgressive } from "src/util/imx";
    import Event from "./Event.svelte";

    const user = $User.address
    const network = Wallet.getNetwork()
    const list = createGenericStore([])
    const signal = createGenericStore(false)

    $: if(list && user) getEventHistoryProgressive(user, network, list, signal)
</script>

<div class="cont" class:loaded={$signal}>
    <div class="title">
        <h2>Transaction history</h2>{#if !$signal}<span class="loading">Loading all events...</span>{/if}
    </div>
    {#each $list as event, index}
        {#if index < 50}
            <Event {event} />
        {/if}
    {/each}
</div>

<style>
    .title {
        display: flex;
        align-items: baseline;
    }

    h2 {
        font-weight: 500;
    }

    .loading {
        margin-left: auto;
        font-size: .9rem;
        color: var(--grey)
    }

    .cont {
        margin: auto;
        max-width: 1040px;
    }

    .cont:not(.loaded) {
        opacity: .5;
        pointer-events: none;
    }
</style>
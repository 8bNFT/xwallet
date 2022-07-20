<script>
    import { createGenericStore } from "src/stores/generics";
    import { Wallet, User } from "src/stores/wallet";
    import { getEventHistoryProgressive } from "src/util/imx";
    import Event from "./Event.svelte";

    const filters = {
        "All transactions": v => true,
        "All transfers": v => v.event === "transfer_in" || v.event === "transfer_out",
        "Incoming transfers": v => v.event === "transfer_in",
        "Outgoing transfers": v => v.event === "transfer_out",
        "All trades": v => v.event === "purchase" || v.event === "sale",
        "Purchases": v => v.event === "purchase",
        "Sales": v => v.event === "sale",
        "All bridging": v => v.event === "deposit" || v.event === "withdrawal",
        "Deposits": v => v.event === "deposit",
        "Withdrawals": v => v.event === "withdrawal"
    }

    const sorting = {
        "Date (desc)": (a, b) => b.timestamp - a.timestamp,
        "Date (asc)": (a, b) => a.timestamp - b.timestamp,
        "Amount (desc)": (a, b) => b.amount - a.amount,
        "Amount (asc)": (a, b) => a.amount - b.amount
    }

    $: user = $User && $User.address || undefined
    const network = Wallet.getNetwork()
    let currentFilter = filters["All transactions"]
    let currentSort = sorting["Date (desc)"]
    let limit = true
    const list = createGenericStore([])
    let eventList = []
    const signal = createGenericStore(false)

    $: if(list && user) { getEventHistoryProgressive(user, network, list, signal) } else { list.set([]) }
    $: eventList = ($list.filter(currentFilter)).sort(currentSort)
</script>

<div class="cont" class:loaded={$signal || $User === false}>
    <div class="title">
        <h2>Transaction history</h2>
        {#if !$signal && $User !== false}
            <span class="loading">Loading all events...</span>
        {:else}
            <span class="limit" on:click={() => limit = !limit }>{limit ? `Show all ${eventList.length} events` : `Show first 20 events`}</span>
            <select bind:value={currentFilter}>
                {#each Object.entries(filters) as [filter, fn]}
                    <option value={fn}>{filter}</option>
                {/each}
            </select>
            <select bind:value={currentSort}>
                {#each Object.entries(sorting) as [sort, fn]}
                    <option value={fn}>{sort}</option>
                {/each}
            </select>
        {/if}
    </div>
    {#each eventList as event, index}
        {#if index < 20 || limit === false}
            <Event {event} />
        {/if}
    {:else}
        <div style="text-align: center; padding: 3rem 0">
            <h3 style="font-weight: 500">Nothing to see here.. yet!</h3>
            {#if $User === false}
                <span class="note"><span on:click={User.login} style="text-decoration:underline;cursor:pointer">Connect your wallet</span> in order to see your transaction history</span>
            {:else}
                <span class="note">Only the past 200 transactions of each type are fetched</span>
            {/if}
        </div>
    {/each}
</div>

<style>
    .title {
        display: flex;
        align-items: baseline;
    }

    h2, h3 {
        font-weight: 500;
    }

    h3 {
        margin: 0;
        margin-bottom: .35rem
    }

    .limit {
        margin-right: auto;
        margin-left: 1rem;
        cursor: pointer
    }

    .loading, select, .limit, .note {
        font-size: .9rem;
        color: var(--grey)
    }

    select {
        border: none;
        background: none;
        outline: none;
        cursor: pointer;
        margin-left: 1rem
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
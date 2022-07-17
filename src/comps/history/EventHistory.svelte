<script>
    import { createGenericStore } from "src/stores/generics";
    import { Wallet, User, tokens } from "src/stores/wallet";
    import { getEventHistoryProgressive } from "src/util/imx";
    import { EVENT_ICONS, sliceAddress } from "src/util/generic";
    import { formatCryptoDisplay } from "src/util/cfx";

    const user = $User.address
    const network = Wallet.getNetwork()
    const list = createGenericStore([])
    const signal = createGenericStore(false)

    const EVENTS = {
        "transfer_in": "Transfer In",
        "transfer_out": "Transfer out",
        "deposit": "Deposit",
        "withdrawal": "Withdrawal"
    }

    const EVENTS_TO_ICONS = {
        transfer_in: "receive",
        transfer_out: "send",
        withdrawal: "withdraw",
        deposit: "deposit"
    }

    $: if(list && user) getEventHistoryProgressive(user, network, list, signal)
</script>

<div class="cont" class:loaded={$signal}>
    <div class="title">
        <h2>Transfers</h2>{#if !$signal}<span class="loading">Loading all events...</span>{/if}
    </div>
    {#each $list as event, index}
        {#if index < 50}
            <div class="event">
                <div class="icon">
                    {@html EVENT_ICONS[EVENTS_TO_ICONS[event.event]]}
                </div>
                <div class="info">
                    <div class="type">{EVENTS[event.event]}</div>
                    <div class="timestamp">{event.timestamp.toISOString().split("T")[0]}</div>
                </div>
                <div class="from">{sliceAddress(event.from)}</div>
                <div class="to">{sliceAddress(event.to)}</div>
                <div class="collection">{tokens[event.token].symbol}</div>
                <div class="amount" class:negative={event.amount < 0}>
                    {formatCryptoDisplay(event.amount)} {tokens[event.token].symbol}
                </div>
            </div>
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
        opacity: .5;
        margin: auto;
        max-width: 1040px;
    }

    .cont.loaded {
        opacity: 1
    }

    .event {
        display: grid;
        grid-template-columns: 40px 1.5fr 2fr 2fr 2fr 2fr;
        gap: .5rem;
        padding: 1rem;
        /* border: 1px solid black; */
        border-radius: 8px;
        margin-bottom: .5rem;
        transition: box-shadow .15s;
        align-items: center;
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        width: 40px;
        border-radius: 8px;
        background: var(--l-grey);
    }

    .info {
        padding-left: .5rem;
    }

    .type {
        margin-bottom: .2em;
        font-weight: 500
    }

    .event:hover {
        box-shadow: 0 20px 40px rgba(0, 0, 0, .08);
    }

    .timestamp {
        color: var(--grey);
        font-size: .9em
    }

    .amount {
        text-align: right;
    }

    .amount.negative {
        color: #dd0909
    }
</style>
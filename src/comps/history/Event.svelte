<script>
    export let event

    import { EVENT_ICONS, sliceAddress } from "src/util/generic";
    import { formatCryptoDisplay } from "src/util/cfx";
    import { tokens, Wallet } from "src/stores/wallet";
import Tooltip from "../Tooltip.svelte";

    const EVENTS = {
        "transfer_in": "Transfer In",
        "transfer_out": "Transfer Out",
        "deposit": "Deposit",
        "withdrawal": "Withdrawal",
        "purchase": "Purchase",
        "sale": "Sale"
    }

    const EVENTS_TO_ICONS = {
        transfer_in: "receive",
        transfer_out: "send",
        withdrawal: "withdraw",
        deposit: "deposit",
        purchase: "trade",
        sale: "trade"
    }
</script>

<div class="event" class:hover={Wallet.getNetwork() === "mainnet"} on:click={Wallet.getNetwork() === "testnet" ? null: () => window.open(`https://immutascan.io/tx/${event.transaction_id}`, '_blank')}>
    <div class="icon">
        {@html EVENT_ICONS[EVENTS_TO_ICONS[event.event]]}
    </div>
    <div class="info">
        <div class="type">{EVENTS[event.event]}</div>
        <Tooltip title={event.timestamp.toUTCString()}>
            <div class="timestamp">{event.timestamp.toISOString().split("T")[0]}</div>
        </Tooltip>
    </div>
    <div class="from">
        <Tooltip title={event.from}>
            {sliceAddress(event.from)}
        </Tooltip>
    </div>
    <div class="to">
        <Tooltip title={event.to}>
            {sliceAddress(event.to)}
        </Tooltip>
    </div>
    <div class="collection">
        {event.collection ? event.collection : tokens[event.token].symbol}
        {#if event.token_id}
            <div class="token_id">{event.token_id}</div>
        {/if}
    </div>
    <div class="amount" class:negative={event.amount < 0}>
        {formatCryptoDisplay(event.amount)} {tokens[event.token].symbol}
    </div>
</div>

<style>
    .event {
        display: grid;
        grid-template-columns: 40px 1.5fr 2fr 2fr 2fr 2fr;
        gap: .5rem;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: .5rem;
        transition: box-shadow .15s;
        align-items: center;
    }

    .event.hover {
        cursor: pointer
    }

    .event:hover {
        box-shadow: 0 20px 40px rgba(0, 0, 0, .08);
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


    .timestamp, .token_id {
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
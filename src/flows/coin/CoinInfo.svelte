<script>
    import { FlowStore } from 'src/stores/generics';
    import { tokens, Balances, Wallet } from "src/stores/wallet";
    import { filterOnrampTokens, filterOfframpTokens } from "src/util/imx";
    import { DEFAULT_TOKEN_ICON } from "src/util/generic";
    import PriceChange from "src/comps/PriceChange.svelte";
    import Tooltip from 'src/comps/Tooltip.svelte';
    import { formatCryptoDisplay, formatFiatDisplay, assetToUSD } from 'src/util/cfx';
    import BasicInfo from 'src/comps/BasicInfo.svelte';
    import FlowButton from 'src/comps/FlowButton.svelte';

    const balanceLabels = {
        "balance": "Active balance",
        "preparing_withdrawal": "Preparing withdrawal",
        "withdrawable": "Ready to withdraw"
    }

    let coin = Object.keys(tokens).includes($FlowStore.props.coin) || Object.keys($Balances)[0]
    $: if(Object.keys(tokens).includes($FlowStore.props.coin)) coin = $FlowStore.props.coin

    let offrampTokens = {}
    const onrampTokens = filterOnrampTokens(tokens, Wallet.getNetwork())
    $: offrampTokens = filterOfframpTokens($Balances, Wallet.getNetwork())

    let token = tokens[coin] || {}
    $: token = tokens[coin] || {}

    let price = 0
    $: price = `1 ${token.symbol} ≈ ${formatFiatDisplay(Number(token.price).toFixed(2))}`
</script>

<div class="title">
    <img src={token.image_url || DEFAULT_TOKEN_ICON} on:error={e => e.target.src = DEFAULT_TOKEN_ICON} alt={`${token.name} icon`} class="icon">
    <div class="info">
        <div class="name">{token.name}</div>
        <div class="ticker">
            <span>{token.symbol}</span>
            {#if token.change}
                <Tooltip title={formatFiatDisplay(token.price)}>
                    <PriceChange change={token.change} />
                </Tooltip>
            {/if}
        </div>
    </div>

    <!-- label, data, note, labelTooltip, dataTooltip, noteTooltip -->
</div>

<div class="data">
    {#each Object.entries(balanceLabels) as [type, label]}
        <div>
            {#if $Balances && coin && $Balances[coin][type]}
                <BasicInfo big {label} data={formatCryptoDisplay($Balances[coin][type].parsed)} noteTooltip={price} note={`≈ ${formatFiatDisplay(assetToUSD($Balances[coin][type].parsed, token.price))}`} />
            {:else}
                <BasicInfo big {label} data={0} note={`≈ ${formatFiatDisplay(0, 0)}`} />
            {/if}
        </div>
    {/each}
</div>

<div class="bottom">
    <Tooltip title="Send">
        <FlowButton resetMargin big value={"Send"} on:click={() => FlowStore.send(coin)} />
    </Tooltip>
    <Tooltip title="Receive">
        <FlowButton resetMargin big value={"Receive"} disabled />
    </Tooltip>
    <Tooltip title="Deposit">
        <FlowButton resetMargin big value={"Deposit"} on:click={() => FlowStore.deposit(coin)} />
    </Tooltip>
    <Tooltip title="Withdraw">
        <FlowButton resetMargin big value={"Withdraw"} on:click={() => FlowStore.withdraw(coin)} />
    </Tooltip>
    <Tooltip title="Buy">
        <FlowButton resetMargin big value={"Buy"} on:click={() => FlowStore.buy(coin)} disabled={!Object.keys(onrampTokens).includes(coin)} />
    </Tooltip>
    <Tooltip title="Sell">
        <FlowButton resetMargin big value={"Sell"} on:click={() => FlowStore.sell(coin)} disabled={!Object.keys(offrampTokens).includes(coin)} />
    </Tooltip>
</div>


<!-- <h1>

</h1> -->

<style>
    .title {
        display: flex;
        align-items: flex-start;
    }

    .icon {
        height: 2rem;
        width: 2rem;
        margin-right: .5rem
    }

    .name {
        font-weight: 500;
        font-size: 1.15rem;
        margin-bottom: .4rem
    }

    .ticker {
        display: flex;
        align-items: center;
        color: var(--grey);
        font-size: .9rem;
    }

    .ticker span {
        opacity: .8;
        font-size: .95rem;
    }

    .data {
        margin-top: 2rem
    }

    .data > div {
        margin-bottom: 1rem
    }

    .bottom {
        margin-top: 1rem;
        background: #F9F9F9;
        width: calc(100% + 3rem);
        margin-bottom: -1.5rem;
        margin-left: -1.5rem;
        padding: 1.5rem;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
        display: flex;
        justify-content: space-around;
    }
</style>
<script>
    export let formStore

    import { Wallet } from "src/stores/wallet";
    import { assetToUSD } from "src/util/cfx";
    import BasicInfo from "src/comps/BasicInfo.svelte";

    $: tokens = $Wallet.tokens
    $: User = $Wallet.User
    $: Balances = $Wallet.Balances
    $: token = tokens[$formStore.coin]
    $: usd_value = `≈ $${assetToUSD($formStore.amount, token.price)} (1 ${token.symbol} ≈ $${parseFloat(Number(token.price).toFixed(2))})`
    $: current = $Balances[$formStore.coin] ? Number($Balances[$formStore.coin].balance.parsed) : 0
    $: current_usd = `≈ $${assetToUSD(current, token.price)} (1 ${token.symbol} ≈ $${parseFloat(Number(token.price).toFixed(2))})`
    $: total = Number($formStore.amount) + (current)
    $: total_usd = `≈ $${assetToUSD(total, token.price)} (1 ${token.symbol} ≈ $${parseFloat(Number(token.price).toFixed(2))})`
</script>

<BasicInfo label={"Deposit to"} dataTooltip={$User.address} data={`${$User.address.slice(0, 6)}...${$User.address.slice(-6)}`} />
<div class="separator"></div>
<BasicInfo label={"Current L2 balance"} data={`${current}`} note={current_usd} />
<div class="separator"></div>
<BasicInfo label={"Amount to deposit"} data={`${$formStore.amount} ${token.symbol}`} note={usd_value} />
<div class="separator"></div>
<BasicInfo label={"L2 balance after deposit"} data={`${total} ${token.symbol}`} note={total_usd} />
<div class="separator"></div>

<script>
    export let formStore

    import { Wallet } from "src/stores/wallet";
    import BasicInfo from "src/comps/BasicInfo.svelte";
    import { assetToUSD } from "src/util/cfx";

    $: tokens = $Wallet.tokens
    $: User = $Wallet.User
    $: token = tokens[$formStore.coin.value]
    $: usd_value = `≈ $${assetToUSD($formStore.amount.value, token.price)} (1 ${token.symbol} ≈ $${parseFloat(Number(token.price).toFixed(2))})`
</script>

<BasicInfo label={"Amount to transfer"} data={`${$formStore.amount.value} ${token.symbol}`} note={usd_value} />
<div class="separator"></div>
<BasicInfo label={"Sender"} data={`${$User.address.slice(0, 4)}...${$User.address.slice(-4)}`} />
<div class="separator"></div>
<BasicInfo label={"Receiver"} data={`${$formStore.receiver.value.slice(0, 4)}...${$formStore.receiver.value.slice(-4)}`} />
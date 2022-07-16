<script>
    export let formStore

    import { User, tokens } from "src/stores/wallet";
    import { assetToUSD } from "src/util/cfx";
    import BasicInfo from "src/comps/BasicInfo.svelte";

    $: token = tokens[$formStore.coin]
    $: usd_value = `≈ ${formatFiatDisplay(assetToUSD($formStore.amount, token.price))} (1 ${token.symbol} ≈ ${formatFiatDisplay(Number(token.price).toFixed(2))})`
</script>

<BasicInfo label={"Amount to transfer"} data={`${$formStore.amount} ${token.symbol}`} note={usd_value} />
<div class="separator"></div>
<BasicInfo label={"Sender"} dataTooltip={$User.address} data={`${$User.address.slice(0, 6)}...${$User.address.slice(-6)}`} />
<div class="separator"></div>
<BasicInfo label={"Receiver"} dataTooltip={$formStore.receiver} data={`${$formStore.receiver.slice(0, 6)}...${$formStore.receiver.slice(-6)}`} />
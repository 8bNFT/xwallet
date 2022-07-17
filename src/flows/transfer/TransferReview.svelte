<script>
    export let formStore

    import { User, tokens } from "src/stores/wallet";
    import { assetToUSD } from "src/util/cfx";
    import BasicInfo from "src/comps/BasicInfo.svelte";
    import { sliceAddress } from "src/util/generic";

    $: token = tokens[$formStore.coin]
    $: usd_value = `≈ ${formatFiatDisplay(assetToUSD($formStore.amount, token.price))} (1 ${token.symbol} ≈ ${formatFiatDisplay(Number(token.price).toFixed(2))})`
</script>

<BasicInfo label={"Amount to transfer"} data={`${$formStore.amount} ${token.symbol}`} note={usd_value} />
<div class="separator"></div>
<BasicInfo label={"Sender"} dataTooltip={$User.address} data={sliceAddress($User.address)} />
<div class="separator"></div>
<BasicInfo label={"Receiver"} dataTooltip={$formStore.receiver} data={sliceAddress($formStore.receiver)} />
<script>
    export let formStore, validationStore

    import { User, tokens } from "src/stores/wallet";
    import CfxInput from "src/comps/CfxInput.svelte";
    import Select from "src/comps/Select.svelte";
    import LabelButton from "src/comps/LabelButton.svelte";
    import { getTokenBalance } from "src/util/blockchain";
    import { limitPrecision } from "src/util/cfx";
    import { DEFAULT_TOKEN_ICON } from "src/util/generic";

    let coin

    const balancesToOptions = (balances) => {
        const options = []
        for(const [id, value] of Object.entries(balances)){
            options.push({
                value: id,
                label: value.symbol,
                icon: value.image_url || DEFAULT_TOKEN_ICON,
                fallback_icon: DEFAULT_TOKEN_ICON
            })
        }

        return options
    }

    const fetchBalance = async (newCoin) => {
        if(coin === newCoin) return
        coin = newCoin

        if($formStore[coin]) return
        $formStore[coin] = limitPrecision(await getTokenBalance({ wallet: $User.address, token: tokens[coin] }), tokens[coin].precision)
    }

    const setAmount = () => $formStore.amount = $formStore[coin]

    $: fetchBalance($formStore.coin)
</script>

<Select bind:value={$formStore.coin} options={balancesToOptions(tokens)} />
<div class="separator"></div>
<CfxInput bind:value={$formStore.amount} valid={$validationStore.amount.valid} error={$validationStore.amount.error} label="Amount" asset={tokens[$formStore.coin]}>
    <div slot="label-right">
        {#if $formStore[coin]}
            <LabelButton slot="label-right" value={"Max. " + $formStore[coin] + " " + tokens[coin].symbol} on:click={setAmount} />
        {/if}
    </div>
</CfxInput>
<div class="separator"></div>
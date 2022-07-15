<script>
    export let formStore, validationStore

    import { Wallet } from "src/stores/wallet";
    import BasicInput from "src/comps/BasicInput.svelte";
    import CfxInput from "src/comps/CfxInput.svelte";
    import Select from "src/comps/Select.svelte";
    import LabelButton from "src/comps/LabelButton.svelte";
    import { getTokenBalance } from "src/util/blockchain";
    import { limitPrecision } from "src/util/cfx";

    let User = $Wallet.User
    let tokens = $Wallet.tokens
    let coin

    const balancesToOptions = (balances) => {
        const options = []
        for(const [id, value] of Object.entries(balances)){
            options.push({
                value: id,
                label: value.symbol,
                icon: value.image_url || "https://design-system.immutable.com/currency_icons/currency--erc20.svg",
                fallback_icon: "https://design-system.immutable.com/currency_icons/currency--erc20.svg"
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

    $: User = $Wallet.User
    $: tokens = $Wallet.tokens
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
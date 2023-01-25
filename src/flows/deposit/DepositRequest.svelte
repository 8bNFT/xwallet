<script>
    export let formStore, validationStore

    import CfxInput from "src/comps/CfxInput.svelte";
    import Select from "src/comps/Select.svelte";
    import LabelButton from "src/comps/LabelButton.svelte";
    import { getTokenBalance } from "src/util/blockchain";
    import { limitPrecision } from "src/util/cfx";
    import { DEFAULT_TOKEN_ICON } from "src/util/generic";
    import { Wallet } from "src/stores/wallet";

    const { User, Tokens } = $Wallet

    let coin
    let address

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

    const fetchBalance = async (newCoin, wallet) => {
        if(coin === newCoin && address === wallet) return
        coin = newCoin
        address = wallet

        $formStore[coin] = limitPrecision(await getTokenBalance({ wallet, token: $Tokens[coin] }), $Tokens[coin].precision)
    }

    const setAmount = () => $formStore.amount = $formStore[coin]

    $: if($User) fetchBalance($formStore.coin, $User.address)
</script>

<Select bind:value={$formStore.coin} options={balancesToOptions($Tokens)} />
<div class="separator"></div>
<CfxInput bind:value={$formStore.amount} valid={$validationStore.amount.valid} error={$validationStore.amount.error} label="Amount" asset={$Tokens[$formStore.coin]}>
    <div slot="label-right">
        {#if $formStore[coin]}
            <LabelButton slot="label-right" value={"Max. " + $formStore[coin] + " " + $Tokens[coin].symbol} on:click={setAmount} />
        {/if}
    </div>
</CfxInput>
<div class="separator"></div>
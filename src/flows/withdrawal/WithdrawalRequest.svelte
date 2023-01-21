<script>
    export let formStore, validationStore, currentStep

    import { Wallet } from "src/stores/wallet";
    import CfxInput from "src/comps/CfxInput.svelte";
    import Select from "src/comps/Select.svelte";
    import BasicInfo from "src/comps/BasicInfo.svelte";
    import LabelButton from "src/comps/LabelButton.svelte";
    import { formatCryptoDisplay } from "src/util/cfx";
    import { DEFAULT_TOKEN_ICON } from "src/util/generic";
    import Toggle from "src/comps/Toggle.svelte";
    import Tooltip from "src/comps/Tooltip.svelte";

    const { Tokens, Balances } = $Wallet

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

    const setAmount = (v) => $formStore.amount = v
</script>

<Toggle toggleStore={currentStep} />
<div class="separator"></div>
{#if $Balances}
    <Select bind:value={$formStore.coin} options={balancesToOptions($Balances)} />
    <div class="separator"></div>
    {#if $currentStep === "prepare"}
        <CfxInput bind:value={$formStore.amount} valid={$validationStore.amount.valid} error={$validationStore.amount.error} label="Amount" asset={$Tokens[$formStore.coin]}>
            <LabelButton slot="label-right" value={"Max. " + $Balances[$formStore.coin].balance.parsed + " " + $Tokens[$formStore.coin].symbol} on:click={() => setAmount($Balances[$formStore.coin].balance.parsed)} />
        </CfxInput>
        <div class="separator"></div>
        <div class="warning">Once you start a withdrawal it <b>can't be cancelled.</b><br/>This step can take between 24 - 48 hours.</div>
    {:else}
        <Tooltip title="This step can take up to 48h!">
            <BasicInfo label={"Preparing withdrawal"} data={`${formatCryptoDisplay($Balances[$formStore.coin].preparing_withdrawal.parsed, $Tokens[$formStore.coin].precision)} ${$Tokens[$formStore.coin].symbol}`} />
        </Tooltip>
        <div class="separator"></div>
        <BasicInfo label={"Withdrawable amount"} data={`${formatCryptoDisplay($Balances[$formStore.coin].withdrawable.parsed, $Tokens[$formStore.coin].precision)} ${$Tokens[$formStore.coin].symbol}`} />
    {/if}
{/if}

<style>
    .warning {
        font-size: .8rem;
        color: var(--grey);
        line-height: 1.35em
    }

    .warning b {
        color: black;
        font-weight: 600
    }
</style>
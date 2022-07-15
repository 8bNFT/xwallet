<script context="module">
    let local_id = 0
</script>

<script>
    import { createToggleStore } from "src/stores/toggle";
    import { assetToUSD, USDToAsset, limitPrecision } from "src/util/cfx";
    import { fly } from "svelte/transition";
    import Toggle from "src/comps/Toggle.svelte";
    import Label from "src/comps/Label.svelte"
    import ErrorMessage from "./ErrorMessage.svelte";

    export let value, valid, error, label, asset

    const toggleStore = createToggleStore([asset.symbol, "usd"])
    $: toggleStore.updateOption(0, asset.symbol)

    const id = `cfx_input_${++local_id}`
    let usd_value = 0
    let last_usd = 0
    let active = false
    $: ASSET_USD = asset.price || 0

    const convertToFiat = (crypto_value)=>{
        if(isNaN(crypto_value)) return ""
        return limitPrecision(assetToUSD(value, ASSET_USD), 2)
    }

    const convertToCrypto = (usd_value)=>{
        const USD = Math.floor(usd_value * 10) / 10
        if(isNaN(USD)) return ""

        return limitPrecision(USDToAsset(USD, ASSET_USD), asset.precision)
    }

    const disableToggle = (usd = false)=>{
        toggleStore.set(usd ? "usd" : asset.symbol)
        toggleStore.disable()
    }

    const sanitizeValue = v => value = limitPrecision(String(v).replace(",", "."), asset.precision)

    const handleConversion = (cv, fv) => {
        if($toggleStore === "usd"){
            if(last_usd === fv){
                value = cv
                usd_value = convertToFiat(cv)
            } else {
                value = convertToCrypto(fv)
            }
        } else {
            usd_value = convertToFiat(cv)
        }

        last_usd = usd_value
    }

    $: !ASSET_USD ? disableToggle() : toggleStore.enable()
    $: sanitizeValue(value)
    $: $toggleStore, handleConversion(value, usd_value)
</script>

<div class:active class:invalid={!valid}>
    <Label {id} {active} error={!valid} {label}>
        <slot name="label-left" slot="left" />
        <slot name="label-right" slot="right" />
    </Label>
    
    <div class="input" class:active class:invalid={!valid}>
        <div class="cfx_flex">
            {#if $toggleStore === "usd"}
                <input pattern="\d*" placeholder={"Amount in USD"} on:focus={() => active = true} on:blur={() => active = false} {id} bind:value={usd_value}>
            {:else}
                <input pattern="\d*" placeholder={`Amount in ${asset.symbol.toUpperCase()}`} on:focus={() => active = true} on:blur={() => active = false} {id} bind:value={value}>
            {/if}
            <div class="toggle">
                <Toggle {toggleStore} small={true} />
            </div>
        </div>
        <div class="secondary__holder">
            {#if $toggleStore === "usd"}
                <div in:fly|local={{y: 30, opacity: 1}} out:fly|local={{y: 30, opacity: 1}} class="secondary">≈ {value || 0} {asset.symbol}</div>
            {:else}
                <div in:fly|local={{y: -30, opacity: 1}} out:fly|local={{y: -30, opacity: 1}} class="secondary">≈ ${usd_value || 0}</div>
            {/if}
        </div>
    </div>

    <ErrorMessage {error} />
</div>

<style>
    .input {
        border: 2px solid var(--l-grey);
        border-radius: 8px;
        transition: all .15s;
        padding: .75rem
    }

    .input.active {
        border-color: var(--accent);
        box-shadow: 0 0 15px rgba(21, 78, 255, .08);
    }

    .input.active.invalid {
        border-color: #ff1515
    }

    input {
        font-size: 1rem;
        display: block;
        width: 100%;
        border: none;
        outline: none;
        padding-right: .3rem;
        padding-bottom: .2rem;
        -moz-appearance: textfield;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .cfx_flex {
        display: flex;
        align-items: center;
    }

    .toggle {
        flex-shrink: 0;
    }

    .secondary__holder {
        display: grid;
        overflow: hidden;
    }

    .secondary {
        grid-area: 1 / 1;
        display: flex;
        align-items: center;
        font-size: .85em;
        color: var(--grey);
        user-select: none;
    }
</style>
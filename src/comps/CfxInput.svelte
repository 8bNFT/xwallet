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

    export let value, valid, error, label, asset, placeholder = ""

    const toggleStore = createToggleStore([asset.symbol, "usd"])
    $: toggleStore.updateOption(0, asset.symbol)

    const id = `cfx_input_${++local_id}`
    let usd_value = 0
    let crypto_value = value
    let currentAsset = asset
    let active = false
    $: ASSET_USD = asset.price || 0

    const convertToFiat = (crypto_value)=>{
        if(isNaN(crypto_value)) return ""
        return assetToUSD(value, ASSET_USD)
    }

    const convertToCrypto = (usd_value)=>{
        const USD = Math.floor(usd_value * 10) / 10
        if(isNaN(USD)) return null

        return limitPrecision(USDToAsset(USD, ASSET_USD), asset.precision)
    }

    const disableToggle = (usd = false)=>{
        toggleStore.set(usd ? "usd" : asset.symbol)
        toggleStore.disable()
    }

    const updateValue = (newValue, force = false) => {
        const isFiat = $toggleStore === "usd"
        if(typeof newValue === "undefined") newValue = $toggleStore === "usd" ? usd_value : crypto_value
        const sanitizedValue = newValue !== "" ? String(newValue).replace(',', '.') : ""

        if(isFiat && !force){
            usd_value = sanitizedValue
            const crypto = convertToCrypto(usd_value)
            crypto_value = crypto
            return value = crypto
        }

        if(isNaN(sanitizedValue)){
            value = ""
            usd_value = convertToFiat(sanitizedValue)
            return crypto_value = sanitizedValue
        }

        const limitValue = sanitizedValue !== "" ? limitPrecision(sanitizedValue, asset.precision) : ""
        if(value !== limitValue) value = limitValue
        crypto_value = limitValue

        return usd_value = convertToFiat(value)
    }

    const updateAsset = (asset) => {
        if(currentAsset.id === asset.id) return
        currentAsset = asset
    }

    const checkExternalUpdate = (_value) => {
        const value = String(_value)
        if(value !== crypto_value){
            if(value === "" && isNaN(crypto_value)) return
            return updateValue(value, true)
        }
    }

    const updateInput = ({ target: { value } }) => updateValue(value)

    $: updateAsset(asset)
    $: !ASSET_USD ? disableToggle() : toggleStore.enable()
    $: $toggleStore || ASSET_USD, updateValue()
    $: checkExternalUpdate(value)
    $: typeof usd_value === "number" ? usd_value = Math.floor(usd_value * (10 ** 2)) / (10 ** 2) : null
</script>

<div class:active class:invalid={!valid}>
    <Label {id} {active} error={!valid} {label}>
        <slot name="label-left" slot="left" />
        <slot name="label-right" slot="right" />
    </Label>
    
    <div class="input" class:active class:invalid={!valid}>
        <div class="cfx_flex">
            {#if $toggleStore === "usd"}
                <input pattern="\d*" on:keyup={updateInput} {placeholder} on:focus={() => active = true} on:blur={() => active = false} {id} bind:value={usd_value}>
            {:else}
                <input pattern="\d*" on:keyup={updateInput} {placeholder} on:focus={() => active = true} on:blur={() => active = false} {id} bind:value={crypto_value}>
            {/if}
            <div class="toggle">
                <Toggle {toggleStore} small={true} />
            </div>
        </div>
        <div class="secondary__holder">
            {#if $toggleStore === "usd"}
                <div in:fly|local={{y: 30, opacity: 1}} out:fly|local={{y: 30, opacity: 1}} class="secondary">≈ {crypto_value || 0} {asset.symbol}</div>
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
        /* padding-bottom: .4rem; */
        font-size: .85em;
        color: var(--grey);
        user-select: none;
    }
</style>
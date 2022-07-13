<script context="module">
    let local_id = 0
</script>

<script>
    import { createToggleStore } from "src/stores/toggle";
import { assetToUSD, USDToAsset } from "src/util/cfx";
    import { fly } from "svelte/transition";
    import Toggle from "./Toggle.svelte";

    export let value, valid, label, asset, placeholder = ""

    let usd_value
    let crypto_value = value
    let active = false
    $: ASSET_USD = asset.price || 0

    const toggleStore = createToggleStore([asset.symbol, "usd"])
    $: toggleStore.updateOption(0, asset.symbol)

    const id = `cfx_input_${++local_id}`

    const convertToFiat = (crypto_value)=>{
        const CRYPTO = parseFloat(crypto_value)
        if(isNaN(CRYPTO)){
            value = ""
            usd_value = ""
            return
        }

        value = crypto_value
        usd_value = assetToUSD(value, ASSET_USD)
    }

    const convertToCrypto = (usd_value)=>{
        const USD = parseFloat(usd_value)
        if(isNaN(USD)){
            value = ""
            crypto_value = ""
            return
        }

        value = USDToAsset(USD, ASSET_USD)
        crypto_value = value
    }

    const disableToggle = ()=>{
        toggleStore.set(asset.symbol)
        toggleStore.disable()
    }

    $: typeof usd_value === "number" ? usd_value = parseFloat(usd_value.toFixed(2)) : null
    $: typeof crypto_value === "number" ? crypto_value = parseFloat(crypto_value.toFixed(6)) : null
    $: !ASSET_USD ? disableToggle() : toggleStore.enable()
    $: $toggleStore === "usd" ? convertToCrypto(usd_value) : convertToFiat(crypto_value)
</script>


<div class="input" class:active class:invalid={!valid}>
    <label for={id}>
        {label}
        {#if !valid}
            <svg xmlns="http://www.w3.org/2000/svg" width="9.149" height="8.697" viewBox="0 0 9.149 8.697">
                <line id="Line_14" data-name="Line 14" x2="6.322" y2="5.871" transform="translate(1.413 1.413)" fill="none" stroke="#ff1515" stroke-linecap="round" stroke-width="2"/>
                <line id="Line_15" data-name="Line 15" x1="6.322" y2="5.871" transform="translate(1.413 1.413)" fill="none" stroke="#ff1515" stroke-linecap="round" stroke-width="2"/>
            </svg>          
        {/if}
    </label>
    
    <div class="cfx_flex">
        {#if $toggleStore === "usd"}
            <input step="1" type="number" {placeholder} on:focus={() => active = true} on:blur={() => active = false} {id} bind:value={usd_value}>
        {:else}
            <input step="0.05" type="number" {placeholder} on:focus={() => active = true} on:blur={() => active = false} {id} bind:value={crypto_value}>
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

<style>
    .input {
        padding: .35rem 0rem;
        border: 2px solid var(--l-grey);
        border-radius: 8px;
        transition: border-color .15s;
        position: relative;
    }

    .input.active {
        border-color: var(--accent)
    }

    .input.active.invalid {
        border-color: #ff1515
    }

    label {
        cursor: text;
        margin-left: .75rem;
        font-size: .7rem;
        color: var(--grey);
        text-transform: uppercase;
        transition: color .15s
    }

    .active label {
        color: var(--accent)
    }

    input {
        display: block;
        width: 100%;
        border: none;
        outline: none;
        font-size: 1rem;
        padding: .4rem .75rem;
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
        margin-right: .7rem
    }

    .secondary__holder {
        display: grid;
        overflow: hidden;
    }

    .secondary {
        grid-area: 1 / 1;
        display: flex;
        align-items: center;
        padding: 0rem .75rem;
        padding-bottom: .4rem;
        font-size: .85em;
        color: var(--grey);
        user-select: none;
    }
</style>
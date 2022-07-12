<script context="module">
    let local_id = 0
</script>

<script>
    import { createToggleStore } from "src/stores/toggle";
    import { fly } from "svelte/transition";
    import Toggle from "./Toggle.svelte";

    export let value, label, placeholder = ""

    let usd_value
    let crypto_value = value
    let active = false

    const ETH_USD = 1061.44
    const toggleStore = createToggleStore(["fct", "usd"])

    const id = `cfx_input_${++local_id}`

    const convertToFiat = (crypto_value)=>{
        const CRYPTO = parseFloat(crypto_value)
        if(isNaN(CRYPTO)){
            value = ""
            usd_value = ""
            return
        }

        value = crypto_value
        usd_value = parseFloat((value * ETH_USD).toFixed(2))
    }

    const convertToCrypto = (usd_value)=>{
        const USD = parseFloat(usd_value)
        if(isNaN(USD)){
            value = ""
            crypto_value = ""
            return
        }

        value = parseFloat((USD / ETH_USD).toFixed(6))
        crypto_value = value
    }

    $: typeof usd_value === "number" ? usd_value = parseFloat(usd_value.toFixed(2)) : null
    $: typeof crypto_value === "number" ? crypto_value = parseFloat(crypto_value.toFixed(6)) : null
    $: $toggleStore === "usd" ? convertToCrypto(usd_value) : convertToFiat(crypto_value)
</script>


<div class="input" class:active>
    <div class="toggle">
        
    </div>

    <label for={id}>
        {label}
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
            <div in:fly={{y: 30, opacity: 1}} out:fly={{y: 30, opacity: 1}} class="secondary">≈ {crypto_value} ETH</div>
        {:else}
            <div in:fly={{y: -30, opacity: 1}} out:fly={{y: -30, opacity: 1}} class="secondary">≈ ${usd_value}</div>
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
<script context="module">
    let local_id = 0
</script>

<script>
    export let value, valid, error, info, label, placeholder = "", disabled
    import ErrorMessage from "./ErrorMessage.svelte"
    import InfoMessage from "./InfoMessage.svelte";
    import Label from "./Label.svelte"

    let active = false
    const id = `basic_input_${++local_id}`
</script>


<div class="input" class:active class:invalid={!valid}>
    <Label {active} {id} {label} error={!valid}>
        <slot name="label-left" slot="left" />
        <slot name="label-right" slot="right" />
    </Label>
    <input {placeholder} on:focus={() => active = true} on:blur={() => active = false} {id} bind:value {disabled}>
    
    <ErrorMessage {error} />
    <InfoMessage {info} />
</div>

<style>
    input {
        border: 2px solid var(--l-grey);
        border-radius: 8px;
        transition: all .15s;
        display: block;
        width: 100%;
        outline: none;
        font-size: 1rem;
        padding: .75rem;
        padding-right: .35rem;
    }    

    .active input {
        border-color: var(--accent);
        box-shadow: 0 0 15px rgba(21, 78, 255, .08);
    }

    .active.invalid input {
        border-color: #ff1515
    }
</style>
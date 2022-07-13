<script context="module">
    let local_id = 0
</script>

<script>
    export let value, valid, label, placeholder = ""

    let active = false
    const id = `basic_input_${++local_id}`
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
    <input {placeholder} on:focus={() => active = true} on:blur={() => active = false} {id} bind:value>
</div>

<style>
    .input {
        padding: .35rem 0rem;
        border: 2px solid var(--l-grey);
        border-radius: 8px;
        transition: border-color .15s
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
    }
</style>
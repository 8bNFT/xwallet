<script context="module">
    let local_id = 0
</script>

<script>
    export let value, label, placeholder = ""

    let active = false
    const id = `basic_input_${++local_id}`
</script>


<div class="input" class:active>
    <label for={id}>
        {label}
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
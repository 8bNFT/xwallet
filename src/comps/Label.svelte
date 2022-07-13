<script>
    export let label, id, active, error
</script>

<label class:active for={id || null}>
    {label}
    {#if error}
        <svg xmlns="http://www.w3.org/2000/svg" width="9.149" height="8.697" viewBox="0 0 9.149 8.697">
            <line id="Line_14" data-name="Line 14" x2="6.322" y2="5.871" transform="translate(1.413 1.413)" fill="none" stroke="#ff1515" stroke-linecap="round" stroke-width="2"/>
            <line id="Line_15" data-name="Line 15" x1="6.322" y2="5.871" transform="translate(1.413 1.413)" fill="none" stroke="#ff1515" stroke-linecap="round" stroke-width="2"/>
        </svg>          
    {/if}
</label>

<style>
    label {
        cursor: text;
        font-size: .85rem;
        color: black;
        transition: color .15s;
        margin-bottom: .35rem;
        display: block;
        color: var(--grey);
        font-size: .85rem;
    }

    label.active {
        color: var(--accent)
    }
</style>
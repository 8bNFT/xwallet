<script>
    export let label, id, active, error
</script>

<div class="label">
    <label class:active for={id || null}>
        {label}
        {#if error}
            <svg xmlns="http://www.w3.org/2000/svg" width="9.149" height="8.697" viewBox="0 0 9.149 8.697">
                <line id="Line_14" data-name="Line 14" x2="6.322" y2="5.871" transform="translate(1.413 1.413)" fill="none" stroke="#ff1515" stroke-linecap="round" stroke-width="2"/>
                <line id="Line_15" data-name="Line 15" x1="6.322" y2="5.871" transform="translate(1.413 1.413)" fill="none" stroke="#ff1515" stroke-linecap="round" stroke-width="2"/>
            </svg>          
        {/if}
    </label>
    <div class="left">
        <slot name="left" />
    </div>
    <div class="right">
        <slot name="right" />
    </div>
</div>


<style>
    .label {
        display: flex;
        margin-bottom: .35rem;
        align-items: center;
        font-size: .85rem;
        color: var(--grey)
    }

    .label .left {
        margin-right: auto;
        margin-left: .3rem
    }

    .label .right {
        margin-left: auto;
    }

    label {
        cursor: text;
        transition: color .15s;
        display: block
    }

    label.active {
        color: var(--accent)
    }
</style>
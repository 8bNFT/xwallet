<script>
    export let label, data, note
</script>

<div>
    <span class="label">{label}</span>
    <div class="data">{data}</div>
    {#if note}
    <span class="note">{note}</span>
    {/if}
</div>

<style>
    .label {
        color: var(--grey);
        font-size: .85rem;
    }

    .data {
        margin-top: .3rem;
        margin-bottom: 0rem
    }

    .note {
        color: var(--grey);
        font-size: .8rem
    }
</style>
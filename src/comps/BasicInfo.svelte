<script>
    export let label, data, note

    import Label from "src/comps/Label.svelte"
</script>

<div>
    <Label {label} />
    <div class="data">{data}</div>
    {#if note}
    <span class="note">{note}</span>
    {/if}
</div>

<style>
    .data {
        margin-bottom: 0rem
    }

    .note {
        color: var(--grey);
        font-size: .8rem
    }
</style>
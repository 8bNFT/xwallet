<script>
    export let label, data, note, labelTooltip, dataTooltip, noteTooltip, big

    import Label from "src/comps/Label.svelte"
    import Tooltip from "./Tooltip.svelte"
</script>

<div class="cont" class:big>
    {#if labelTooltip}
        <Tooltip title={labelTooltip}>
            <Label {label} />
        </Tooltip>
    {:else}
        <Label {label} />
    {/if}

    {#if dataTooltip}
        <Tooltip title={dataTooltip}>
            <div class="data">{data}</div>  
        </Tooltip>
    {:else}
        <div class="data">{data}</div>
    {/if}

    {#if note}
        {#if noteTooltip}
            <Tooltip title={noteTooltip}>
                <span class="note">{note}</span>
            </Tooltip>
        {:else}
            <span class="note">{note}</span>
        {/if}
    {/if}
</div>

<style>
    .cont {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .data {
        margin-bottom: 0rem
    }

    .note {
        margin-top: .25rem;
        color: var(--grey);
        font-size: .8rem
    }

    .big .data {
        font-size: 1.15rem;
        font-weight: 500
    }
</style>
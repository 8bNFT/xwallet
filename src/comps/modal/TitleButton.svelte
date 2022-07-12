<script>
    export let type, config, defaultConfig, current, max, action

    $: text = config?.text || defaultConfig?.text
</script>

<button on:click={action({current, max})} class={type}>
    {#if type === "prev"}
        <svg xmlns="http://www.w3.org/2000/svg" width="12.977" height="11.597" viewBox="0 0 12.977 11.597">
            <g id="Icon_feather-arrow-left" data-name="Icon feather-arrow-left" transform="translate(1 1.414)">
            <path id="Path_4" data-name="Path 4" d="M10.977,0H0" transform="translate(0 4.384)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            <path id="Path_5" data-name="Path 5" d="M4.384,8.769,0,4.384,4.384,0" transform="translate(0)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </g>
        </svg>
    {/if}
    <span>{typeof text === "string" ? text : typeof text === "function" ? text({current, max}) : ""}</span>
    {#if type === "next"}
        <svg style="transform: rotate(180deg)" xmlns="http://www.w3.org/2000/svg" width="12.977" height="11.597" viewBox="0 0 12.977 11.597">
            <g id="Icon_feather-arrow-left" data-name="Icon feather-arrow-left" transform="translate(1 1.414)">
            <path id="Path_4" data-name="Path 4" d="M10.977,0H0" transform="translate(0 4.384)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            <path id="Path_5" data-name="Path 5" d="M4.384,8.769,0,4.384,4.384,0" transform="translate(0)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </g>
        </svg>
    {/if}
</button>

<style>
    button {
        border: none;
        background: none;
        padding: 0;
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: padding .15s
    }

    button.next {
        margin-left: auto
    }

    button.prev {
        margin-right: auto
    }

    button.next:hover {
        padding-right: .15rem
    }

    button.prev:hover {
        padding-left: .15rem
    }

    span {
        display: block;
        margin: 0 .35rem
    }
</style>
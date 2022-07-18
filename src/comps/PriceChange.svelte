<script>
    export let change
</script>

<span class="change" class:negative={change["1d"] < 0} class:neutral={change["1d"] == 0}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8.627 5.348">
        <g id="Icon_feather-trending-up" data-name="Icon feather-trending-up" transform="translate(-0.793 -8.293)">
        <path id="Path_14" data-name="Path 14" d="M8.712,9,5.6,12.114,3.959,10.475,1.5,12.934" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
        <path id="Path_15" data-name="Path 15" d="M25.5,9h1.967v1.967" transform="translate(-18.755)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
        </g>
    </svg>
    <span>
        {change["1d"]}%
    </span>            
</span>

<style>
    .change {
        margin-left: .5rem;
        display: flex;
        align-items: center;
        font-size: .6em;
        padding: .45em;
        background: #ECF9F4;
        border-radius: 3px;
        color: #279B80;
        font-weight: 600
    }

    .change.neutral {
        color: var(--grey);
        background: var(--l-grey)
    }

    .change.neutral svg {
        transform: rotate(-45deg) scaleY(-1)
    }

    .change.negative {
        color: #dd0909;
        background: #fdeaea;
    }

    .change.negative svg {
        transform: scaleY(-1)
    }

    .change svg {
        height: .7em;
        margin-right: .4em
    }
</style>
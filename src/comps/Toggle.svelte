<script>
    export let toggleStore, small = false
</script>

<div class="cont" class:small on:click={toggleStore.toggle}>
    {#each toggleStore.options() as option}
        <div class="option" class:active={option === $toggleStore}>{option}</div>
    {/each}
    <div class={toggleStore.options().indexOf($toggleStore) == 0 ? 'background left' : 'background right'}></div>
</div>

<style>
    .cont {
        background: var(--l-grey);
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: .35rem;
        border-radius: 8px;
        position: relative;
    }

    .cont.small {
        padding: .3rem;
        border-radius: 4px
    }

    .option {
        padding: .5rem;
        font-size: .75rem;
        font-weight: 500;
        flex: 50%;
        flex-shrink: 0;
        text-align: center;
        background: rgba(255, 255, 255, 0);
        cursor: pointer;
        z-index: 1;
        position: relative;
        user-select: none;
        text-transform: uppercase;
    }

    .small .option {
        font-size: .6rem;
        padding: .2rem;
    }

    .background {
        border-radius: 6px;
        position: absolute;
        height: calc(100% - .7rem);
        width: 50%;
        background: white;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, .05);
        top: .35rem;
        z-index: 0;
        left: .35rem;
        transition: left .15s
    }

    .small .background {
        width: calc(50% - .3rem);
        height: calc(100% - .6rem);
        top: .3rem;
        border-radius: 2px;
        left: .3rem;
    }

    .background.right {
        left: calc(50% - .35rem);
    }

    .small .background.right {
        left: calc(50%)
    }
</style>
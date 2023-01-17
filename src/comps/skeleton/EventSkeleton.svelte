<script>
    import Text from "./Text.svelte";
    import Icon from "./Icon.svelte";
    import { randomInt } from "src/util/generic";
</script>

<div class="cont">
    <div class="title">
        <h2>Transaction history</h2>
    </div>
    {#each new Array(10) as _}
        <div class="event">
            <div class="icon">
                <Icon />
            </div>
            <div class="info">
                <div class="type"><Text w={40 + randomInt(40) + "%"} /></div>
                <!-- <div class="timestamp"><Text /></div> -->
            </div>
            <div class="from">
                <Text w={40 + randomInt(40) + "%"} />
            </div>
            <div class="to">
            </div>
            <div class="collection">
                <Text w={50 + randomInt(20) + "%"} />
            </div>
            <div class="amount">
                <Text w={3 + randomInt(4) + "rem"} />
            </div>
        </div>
    {/each}
</div>

<style>
    .title {
        display: flex;
        align-items: baseline;
    }

    h2 {
        font-weight: 500;
    }

    .cont:not(.loaded) {
        opacity: .5;
        pointer-events: none;
    }

    .event {
        display: grid;
        grid-template-columns: 40px 1.5fr 2fr 2fr 2fr 2fr;
        gap: .5rem;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: .5rem;
        transition: box-shadow .15s;
        align-items: center;
    }

    .event:hover {
        box-shadow: 0 20px 40px rgba(0, 0, 0, .08);
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        width: 40px;
        border-radius: 8px;
        background: var(--l-grey);
    }

    .info {
        padding-left: .5rem;
    }

    .type {
        margin-bottom: .2em;
        font-weight: 500
    }

    .amount {
        display: flex;
        justify-content: flex-end;
    }
</style>
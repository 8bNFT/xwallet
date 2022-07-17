<script>
    export let steps, defaultConfig, stepStore, overlayCloses

    import { createStepStore } from "src/stores/steps";
    import FooterButton from "./FooterButton.svelte";
    import TitleButton from "./TitleButton.svelte";
    import { fade, scale, fly } from "svelte/transition";
    import { flyIn, flyOut, heightIn, heightOut } from "src/util/transition"
import { now } from "svelte/internal";

    const STEP_STORE = stepStore || createStepStore(steps.length, false)

    let content_holder
    let direction = true
    let last_step = $STEP_STORE

    const detectDirection = (step) => {
        let _temp = last_step
        last_step = step
        if(_temp > step) return direction = false
        return direction = true
    }

    $: detectDirection($STEP_STORE)
</script>

<div in:fade={{duration: 200}} out:fade={{duration: 150}} on:click={overlayCloses && defaultConfig.close ? defaultConfig.close : null} class="overlay"></div>
<div in:fly={{y: 200, duration: 350}} out:scale={{start: 0.8, duration: 150}} class="cont_fixed">
    <div class="cont">
        {#if defaultConfig.close}
            <div class="close" on:click={defaultConfig.close}>
                <svg xmlns="http://www.w3.org/2000/svg" width="9.237" height="9.237" viewBox="0 0 9.237 9.237">
                    <g id="Icon_feather-plus" data-name="Icon feather-plus" transform="translate(-1.79 4.619) rotate(-45)">
                        <path id="Path_6" data-name="Path 6" d="M18,7.5v9.064" transform="translate(-13.468 -7.5)" fill="none" stroke="#6e6e6e" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                        <path id="Path_7" data-name="Path 7" d="M7.5,18h9.064" transform="translate(-7.5 -13.468)" fill="none" stroke="#6e6e6e" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    </g>
                </svg>                  
            </div>
        {/if}
        {#if steps[$STEP_STORE].title !== false}
            <div class="title_strip">
                {#if $STEP_STORE > 0 && steps[$STEP_STORE].title?.prev !== false}
                    <TitleButton 
                        type="prev"
                        config={steps[$STEP_STORE].title?.prev}
                        defaultConfig={defaultConfig.title.prev}
                        current={$STEP_STORE}
                        max={STEP_STORE.getMax()}
                        action={STEP_STORE.prev}
                    />
                {/if}
                {#if steps[$STEP_STORE].title?.text}
                    {#if typeof steps[$STEP_STORE].title.text === "string"}
                        <span>{steps[$STEP_STORE].title.text}</span>
                    {:else if typeof steps[$STEP_STORE].title.text === "function"}
                        <span>{steps[$STEP_STORE].title.text({current: $STEP_STORE, max: STEP_STORE.getMax()})}</span>
                    {/if}
                {:else if steps[$STEP_STORE].title !== false && defaultConfig.title.text}
                    {#if typeof defaultConfig.title.text === "string"}
                        <span>{defaultConfig.title.text}</span>
                    {:else if defaultConfig.title.text === "function"}
                        <span>{defaultConfig.title.text({current: $STEP_STORE, max: STEP_STORE.getMax()})}</span>
                    {/if}
                {/if}
                {#if steps[$STEP_STORE].title?.next}
                    <TitleButton 
                        type="next"
                        config={steps[$STEP_STORE].title?.next}
                        defaultConfig={defaultConfig.title.next}
                        current={$STEP_STORE}
                        max={STEP_STORE.getMax()}
                        action={STEP_STORE.next}
                    />
                {/if}
            </div>
        {/if}
        <div bind:this={content_holder} class="content_holder">
            {#key $STEP_STORE}
                <div
                    on:outrostart={() => content_holder.style.overflow = "hidden"}
                    on:introend={() => content_holder.style.overflow = "visible"}
                    out:flyOut|local={{x: direction && -400 || 400, duration: 350}} 
                    in:flyIn|local={{x: direction && 400 || -400, duration: 350}} 
                    class="content"
                >
                    <svelte:component
                        this={steps[$STEP_STORE].component} 
                        {...(steps[$STEP_STORE].props || {})} 
                        {...(defaultConfig.props || {})}
                        stepControl={STEP_STORE}    
                    />
                </div>
            {/key}
        </div>
        <div class="footer_buttons">
            {#if steps[$STEP_STORE].footer?.primary}
                <div in:heightIn|local={{ duration: 350}} out:heightOut|local={{ duration: 350}}>
                    <FooterButton 
                        disabled={steps[$STEP_STORE].footer?.primary.disabled && steps[$STEP_STORE].footer.primary.disabled() || defaultConfig.footer.primary.disabled()}
                        loading={steps[$STEP_STORE].footer?.primary.loading && steps[$STEP_STORE].footer.primary.loading() || false}
                        type="primary"
                        config={steps[$STEP_STORE].footer.primary}
                        defaultConfig={defaultConfig.footer.primary}
                        current={$STEP_STORE}
                        max={STEP_STORE.getMax()}
                    />
                </div>
            {/if}
            {#if steps[$STEP_STORE].footer?.secondary}
                <div in:heightIn|local={{ duration: 350}} out:heightOut|local={{ duration: 350}}>
                    <FooterButton 
                        type="secondary"
                        config={steps[$STEP_STORE].footer.secondary}
                        defaultConfig={defaultConfig.footer.secondary}
                        current={$STEP_STORE}
                        max={STEP_STORE.getMax()}
                    />
                </div>
            {/if}
        </div>
    </div>
</div>


<style>
    .overlay {
        position: fixed;
        z-index: 1;
        background: rgba(255, 255, 255, .5);
        opacity: 1;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
        backdrop-filter: blur(20px);
    }

    .cont_fixed {
        z-index: 2;
        position: fixed;
        left: 50%;
        top: 250px;
        transform: translateX(-50%);
        max-width: 400px;
        width: 100%;
    }

    @media screen and (max-height: 800px){
        .cont_fixed {
            top: 100px
        }
    }

    @media screen and (max-height: 600px){
        .cont_fixed {
            top: 50px
        }
    }

    .cont {
        background: white;
        width: 100%;
        border-radius: 16px;
        position: relative;
        box-shadow: 0 0 80px rgba(0, 0, 0, .1);
        width: 100%;
        padding: 1.5rem;
    }

    .close {
        padding: .25rem;
        position: absolute;
        right: -1rem;
        top: -1rem;
        cursor: pointer;
        opacity: .7;
        transition: opacity .15s; 
    }

    .close:hover {
        opacity: 1
    }

    .close svg {
        display: block
    }

    .cont, .footer_buttons, .content {
        display: flex;
        flex-direction: column;
    }

    .footer_buttons {
        overflow: hidden;
    }

    :global(.footer_buttons button) {
        width: 100%
    }

    :global(.footer_buttons > div:nth-child(1)) {
        margin-top: 2.5rem
    }

    :global(.footer_buttons > div:nth-child(2)) {
        margin-top: .5rem
    }

    .title_strip {
        display: grid;
        grid-template-columns: 1fr 3fr 1fr;
        text-align: center;
    }

    .title_strip span {
        font-weight: 500;
        grid-column: 2;
    }

    :global(.title_strip button:nth-child(2)) {
        grid-column: 3;
    }

    :global(.title_strip > *) {
        margin-bottom: 2.5rem
    }

    .content_holder {
        display: grid;
        /* overflow: hidden; */
        align-items: flex-start;
        align-content: flex-start;
        width: calc(100% + 3rem);
        margin-left: -1.5rem;
        padding: 0 1.5rem;
    }

    .content {
        grid-area: 1 / 1;
    }

    @media screen and (max-width: 800px){
        .cont_fixed {
            max-width: none
        }

        .cont {
            border-radius: 0;
        }

        .close {
            right: 0;
            top: -1.5rem
        }
    }
</style>
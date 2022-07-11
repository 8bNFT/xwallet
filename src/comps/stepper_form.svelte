<script>
    export let steps, defaultConfig, stepStore, overlayCloses

    import { createStepStore } from "@/stores/steps";
    import FooterButton from "./form/footer_button.svelte";
    import TitleButton from "./form/title_button.svelte";
    import { fade, scale } from "svelte/transition";

    let test = "why"

    const STEP_STORE = stepStore || createStepStore(steps.length, false)
</script>

<div in:fade={{duration: 500}} out:fade={{duration: 150}} on:click={overlayCloses && defaultConfig.close ? defaultConfig.close : null} class="overlay"></div>
<div in:scale={{start: 0.8, duration: 500}} out:scale={{start: 0.8, duration: 150}} class="cont_fixed">
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
        <div class="title_strip">
            {#if steps[$STEP_STORE].title?.primary}
                <TitleButton 
                    type="primary"
                    config={steps[$STEP_STORE].title.primary}
                    defaultConfig={defaultConfig.title.primary}
                    current={$STEP_STORE}
                    max={STEP_STORE.getMax()}
                />
            {/if}
            {#if steps[$STEP_STORE].title?.text}
                {#if typeof steps[$STEP_STORE].title.text === "string"}
                    <span>{steps[$STEP_STORE].title.text}</span>
                {:else if typeof steps[$STEP_STORE].title.text === "function"}
                    <span>{steps[$STEP_STORE].title.text({current: $STEP_STORE, max: STEP_STORE.getMax()})}</span>
                {/if}
            {/if}
            {#if steps[$STEP_STORE].title?.secondary}
                <TitleButton 
                    type="secondary"
                    config={steps[$STEP_STORE].title.secondary}
                    defaultConfig={defaultConfig.title.secondary}
                    current={$STEP_STORE}
                    max={STEP_STORE.getMax()}
                />
            {/if}
        </div>
        <div class="content">
            <svelte:component
                this={steps[$STEP_STORE].component} 
                {...steps[$STEP_STORE].props} 
                stepControl={STEP_STORE}    
            />
        </div>
        <div class="footer_buttons">
            {#if steps[$STEP_STORE].footer?.primary}
                <FooterButton 
                    type="primary"
                    config={steps[$STEP_STORE].footer.primary}
                    defaultConfig={defaultConfig.footer.primary}
                    current={$STEP_STORE}
                    max={STEP_STORE.getMax()}
                />
            {/if}
    
            {#if steps[$STEP_STORE].footer?.secondary}
                <FooterButton 
                    type="secondary"
                    config={steps[$STEP_STORE].footer.secondary}
                    defaultConfig={defaultConfig.footer.secondary}
                    current={$STEP_STORE}
                    max={STEP_STORE.getMax()}
                />
            {/if}
        </div>
    </div>
</div>


<style>
    .overlay {
        position: fixed;
        z-index: 1;
        background: rgba(0, 0, 0);
        opacity: .25;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
    }

    .cont_fixed {
        z-index: 2;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        max-width: 400px;
        width: 100%;
        background: white;
        border-radius: 16px;
        overflow: hidden;
    }

    .cont {
        position: relative;
        width: 100%;
    }

    .close {
        padding: .25rem;
        position: absolute;
        right: 1rem;
        top: 1rem;
        transform: translate(50%, -50%);
        cursor: pointer;
        opacity: .4;
        transition: opacity .15s
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

    :global(.footer_buttons button:nth-child(1)) {
        margin-top: 1.5rem
    }

    :global(.footer_buttons button:nth-child(2)) {
        margin-top: .5rem
    }

    .cont {
        padding: 1.5rem
    }

    .title_strip {
        display: flex;
        justify-content: space-evenly;
        text-align: center;
    }

    .title_strip span {
        font-weight: 500;
    }

    .title_strip > * {
        margin-bottom: 1.5rem
    }

    @media screen and (max-width: 400px){
        .cont_fixed {
            border-radius: 0;
        }
    }
</style>
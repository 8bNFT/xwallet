<script>
    export let close, overlayCloses, title

    import { fade, scale, fly } from "svelte/transition";
</script>

<div in:fade={{duration: 200}} out:fade={{duration: 150}} on:click={overlayCloses && close ? close : null} class="overlay"></div>
<div in:fly={{y: 200, duration: 350}} out:scale={{start: 0.8, duration: 150}} class="cont_fixed">
    <div class="cont">
        {#if close}
            <div class="close" on:click={close}>
                <svg xmlns="http://www.w3.org/2000/svg" width="9.237" height="9.237" viewBox="0 0 9.237 9.237">
                    <g id="Icon_feather-plus" data-name="Icon feather-plus" transform="translate(-1.79 4.619) rotate(-45)">
                        <path id="Path_6" data-name="Path 6" d="M18,7.5v9.064" transform="translate(-13.468 -7.5)" fill="none" stroke="#6e6e6e" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                        <path id="Path_7" data-name="Path 7" d="M7.5,18h9.064" transform="translate(-7.5 -13.468)" fill="none" stroke="#6e6e6e" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    </g>
                </svg>                  
            </div>
        {/if}

        <div class="title_strip">
            <slot name="title-left" />
            {#if title}
                {#if typeof title === "string"}
                    <span>{title}</span>
                {:else if typeof title === "function"}
                    <span>{title()}</span>
                {/if}
            {/if}
            <slot name="title-right" />
        </div>
        <div class="content_holder">
            <slot />
        </div>
        <div class="footer_buttons">
            <slot name="footer-primary" />
            <slot name="footer-secondary" />
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
        top: 200px;
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

    .cont, .footer_buttons {
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
        align-items: flex-start;
        align-content: flex-start;
        width: calc(100% + 3rem);
        margin-left: -1.5rem;
        padding: 0 1.5rem;
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
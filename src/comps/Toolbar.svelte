<script>
    import { fly } from "svelte/transition";
    import Button from "./Button.svelte";

    export let primaryAction, secondaryAction, position = "top"
</script>

<div transition:fly={{ y: 10, duration: 250 }} class={`toolbar ${position}`}>
    <div class="text">
        <slot></slot>
    </div>
    <div class="button">
        {#if secondaryAction}
            <Button text={secondaryAction.text} type="secondary" action={secondaryAction.action} small={true} disabled={secondaryAction.disabled || secondaryAction.loading} />
        {/if}
    </div>
    <div class="button">
        {#if primaryAction}
            <Button text={primaryAction.text} action={primaryAction.action} small={true} disabled={primaryAction.disabled || primaryAction.loading} />
        {/if}
    </div>
</div>

<style>
    .toolbar {
        position: fixed;
        width: 100%;
        background: red;
        max-width: var(--max-width);
        padding: 1rem;
        border-radius: 8px;
        background: white;
        border: 1px solid var(--l-grey);
        z-index: 9999;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, .04);
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
    }

    .text {
        font-size: .95rem;
        margin-right: auto
    }

    .button + .button {
        margin-left: .5rem
    }

    .toolbar.top {
        top: 1rem;
    }

    .toolbar.bottom {
        bottom: 1rem;
    }
</style>
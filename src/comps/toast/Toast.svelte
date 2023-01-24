<script>
    export let type = "info"

    import { fly } from "svelte/transition";

    const capitalize = t => t[0].toUpperCase() + t.slice(1).toLowerCase()
</script>

<div transition:fly={{ y: -10, duration: 350 }} class={`toast ${type}`}>
    <div class="icon">
        <img src={`./emojis/emoji_toast_${type}.png`} />
    </div>
    <div class="content">
        <div class="title">{capitalize(type)}</div>
        <slot></slot>
    </div>
</div>

<style>
    .toast {
        padding: .8rem 1.25rem;
        font-size: .8rem;
        line-height: 1.3em;
        margin-bottom: .5rem;
        display: flex;
        background: white;
        border-radius: 8px;
        align-items: center;
        border: 2px solid #f5f5f5;
    }

    .icon {
        height: 1.75em;
        width: 1.75em;
        margin-right: 1rem;
        flex-shrink: 0;
    }

    img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain
    }

    .title {
        color: black;
        margin-bottom: .15em;
        font-weight: 500;
    }

    .error .title {
        color: rgb(167, 0, 0)
    }

    .warning .title {
        color: rgb(221, 81, 0)
    }

    .content {
        color: var(--grey)
    }
</style>
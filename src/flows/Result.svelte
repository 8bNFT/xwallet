<script>
    export let resultStore, title

    import { scale } from "svelte/transition"

    $: status = typeof resultStore.error !== "undefined" ? "error" : "success"
</script>

<div class="cont">
    <div class="image">
        <img in:scale={{start: 0.8, delay: 400}} src={`./emojis/emoji_${status}.png`} alt={status + " emoji"} />
    </div>

    <div class="title">
        {#if title}
            {#if typeof title === "function"}
                {title()}
            {:else}
                {title}
            {/if}
        {:else}
            {status == "error" ? "Oops! Error occured." : "Success!"}
        {/if}
    </div>

    <div class="message">
        {@html (resultStore.message || resultStore.error || "")}
    </div>
</div>

<style>
    .cont {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 4rem
    }

    .image {
        background: var(--l-grey);
        padding: 25px;
        border-radius: 50%;
        margin-top: 1.5rem;
        margin-bottom: 2.5rem
    }

    img {
        display: block;
        height: 50px
    }

    .title {
        margin-bottom: .75rem;
        font-weight: 500;
        font-size: 1.15rem
    }

    .message {
        color: var(--grey);
        font-size: .9rem;
        line-height: 1.4em;
        text-align: center;
    }

    :global(.message span) {
        color: black;
        font-weight: 500
    }
</style>

<!-- {#if resultStore.error}
<h1>{resultStore.error}</h1>
{:else}
<h3>{resultStore.message}</h3>
{/if} -->
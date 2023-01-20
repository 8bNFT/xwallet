<script>
    import Toast from "./Toast.svelte";
    import { ToastStore } from "src/stores/toast";
</script>

<div class="holder">
    {#each $ToastStore as toast (toast.expiration)}
        <Toast type={toast.type}>{toast.message}</Toast>
    {/each}
</div>

<style>
    .holder {
        position: fixed;
        right: 1rem;
        top: 1rem;
        max-width: 300px;
        z-index: 9999999999;
    }
</style>
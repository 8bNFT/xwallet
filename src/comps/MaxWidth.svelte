<script>
    export let maxWidth = "var(--max-width)"
</script>

<div style={`max-width: ${maxWidth}`}>
    <slot></slot>
</div>

<style>
    div {
        width: 100%;
        margin: auto;
    }
</style>
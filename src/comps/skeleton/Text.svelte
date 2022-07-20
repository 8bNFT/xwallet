<script>
    export let w
</script>

<div style={`width:${w || "100%"}`}></div>

<style>
    div {
        height: 1em;
        width: 100%;
        border-radius: 4px;
        animation: skeleton-loading 1s linear infinite alternate;
    }

    @keyframes skeleton-loading {
    0% {
        background-color: hsl(0, 0%, 82%);
    }
    100% {
        background-color: hsl(0, 0%, 95%);
    }
    }
</style>
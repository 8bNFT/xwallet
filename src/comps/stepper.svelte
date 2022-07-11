<script>
    export let store

    const steps = store.getMaxIter()
</script>

<h1>Steps: {steps}</h1>
<h2>Current {$store + 1}</h2>

<div class="steps">
    {#each Array(steps) as _, i}
        <span on:click={()=>store.goto(i)} class="step" class:active={$store == i}></span>
    {/each}
</div>

<style>
    .steps {
        display: flex;
        font-size: 0
    }

    .step {
        height: 20px;
        width: 20px;
        border-radius: 10px;
        border: 2px solid red
    }

    .step.active {
        background: red;
    }
</style>

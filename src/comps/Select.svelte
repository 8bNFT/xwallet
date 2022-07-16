<script>
    export let options, value

    import { fly } from "svelte/transition"
    import Label from "src/comps/Label.svelte"
    
    let bigContainer, container, optionsCont
    let open = false

    const findFirstValue = (options) => {
        const firstAvailable = options.find(v => !v.unavailable)
        if(!firstAvailable) return value = null // disable dropdown
        return value = firstAvailable.value
    }

    const findOption = (id) => {
        const option = options.find(v => v.value === id)
        if(!option){
            value = null
            return {value: "", label: ""}
        }

        return option
    }

    const setOption = (id) => {
        const option = findOption(id)
        value = option.value
    }

    const checkIfClose = (e) => {
        if(bigContainer.contains(e.target)) return
        open = false
    }

    const resizeSelect = () => {
        if(!container || !open || !optionsCont) return
        const holder = container.closest(".content_holder") || window
        optionsCont.style.maxHeight = `${holder.clientHeight - bigContainer.offsetHeight - 7}px`
    }

    const scrollToSelected = () => {
        if(!container || !open || !optionsCont) return
        const selected = container.querySelector('.option.selected')
        if(!selected) return
        if(selected.offsetTop + selected.clientHeight <= optionsCont.clientHeight) return
        optionsCont.scrollTop = selected.offsetTop
    }

    $: if(!value) findFirstValue(options)
    $: valueStore = findOption(value)
    $: open && resizeSelect()
</script>

<svelte:window on:resize={!open ? null : resizeSelect} on:click={!open ? null : checkIfClose} />

<div bind:this={bigContainer} class:open>
    <div on:click={() => open = true}>
        <Label label="Asset" active={open} />
    </div>

    <div on:click={() => open = !open} class="select" bind:this={container}>
        <div class="current">
            {#if valueStore.icon}
                <img src={valueStore.icon} alt={`${valueStore.label} icon`} class="icon" on:error={valueStore.fallback_icon ? this.src = valueStore.fallback_icon : null} />
            {/if}
            <span>{valueStore.label}</span>
        </div>
        <svg class="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd"
                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clip-rule="evenodd"></path>
        </svg>
        {#if open}
        <div bind:this={optionsCont} on:introstart={() => {resizeSelect(); scrollToSelected()}} transition:fly={{y: 10, duration: 200}} class="options scrollbar--thin">
            {#each options as option}
                <div class="option" class:selected={option.value === value} class:disabled={option.unavailable} on:click={option.unavailable ? null : () => setOption(option.value)}>
                    {#if option.icon}
                        <img src={option.icon} class="icon" alt={`${option.label} icon`} on:error={option.fallback_icon ? this.src = option.fallback_icon : null} />
                    {/if}
                    <span>{option.label}</span>
                    {#if option.value === value}
                        <svg class="check" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                            <circle id="Ellipse_73" data-name="Ellipse 73" cx="10" cy="10" r="10" fill="rgba(21,78,255,0.12)"/>
                            <line id="Line_16" data-name="Line 16" x2="2.56" y2="3" transform="translate(6.5 9.5)" fill="none" stroke="#154eff" stroke-linecap="round" stroke-width="2"/>
                            <line id="Line_17" data-name="Line 17" x1="5.011" y2="5.011" transform="translate(9.06 7.489)" fill="none" stroke="#154eff" stroke-linecap="round" stroke-width="2"/>
                        </svg> 
                    {/if}
                </div>
            {/each}
        </div>
        {/if}
    </div>    
</div>

<style>
    .select {
        position: relative;
        user-select: none;
        border: 2px solid var(--l-grey);
        border-radius: 8px;
        outline-color: var(--accent);
        transition: all .15s;
    }

    .open .select {
        border-color: var(--accent);
        box-shadow: 0 0 15px rgba(21, 78, 255, .08);
    }
    
    .current {
        padding: .75rem;
    }

    .current, .option {
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .current img.icon, .option img.icon {
        margin-right: .25rem;
        width: 1em;
        height: 1em;
    }

    .options {
        position: absolute;
        z-index: 10;
        background: white;
        width: calc(100% + 4px);
        left: -2px;
        border: 2px solid white;
        margin-top: .5rem;
        overflow: auto;
        border-radius: 8px;
        box-shadow: 0 0px 20px rgba(0, 0, 0, .06);
    }

    .option {
        padding: 14px .75rem;
    }

    .option svg.check, svg.arrow {
        margin-left: auto        
    }

    svg.arrow {
        max-height: 1.25em;
        color: var(--grey);
        opacity: .6;
        transition: opacity .2s;
        position: absolute;
        right: calc(.75rem - 5px);
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
    }

    .select:hover svg.arrow, .select.open svg.arrow {
        opacity: 1
    }

    .option::before {
        content: '';
        z-index: -1;
        left: 4px;
        top: 4px;
        position: absolute;
        height: calc(100% - 8px);
        width: calc(100% - 8px);
        background: var(--l-grey);
        border-radius: 6px;
        opacity: 0;
        transform: scale(0.8);
        transition: all .15s;
    }

    .option.selected {
        font-weight: 600
    }

    .option:hover::before {
        opacity: 1;
        transform: scale(1)
    }
</style>
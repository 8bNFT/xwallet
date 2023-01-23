<script>
    export let targetsQuery, enabled
    import { createEventDispatcher } from "svelte";
    const emit = createEventDispatcher()

    let area
    let drag = {dragging: false, x1: 0, y1: 0, x2: 0, y2: 0, scroll: {x: 0, y: 0}}

    const startDrag = e => {
        if(e.target.id !== "app") return
        window.getSelection()?.removeAllRanges()
        document.body.style = "user-select: none"
        drag = {
            ...drag,
            x1: e.clientX,
            y1: e.clientY,
            dragging: true,
            scroll: {
                x: window.scrollX,
                y: window.scrollY
            }
        }
    }

    const moveDrag = e => {
        drag = {
            ...drag,
            x2: e.clientX,
            y2: e.clientY
        }

        updateSelect(e.ctrlKey)
    }

    const endDrag = e => {
        document.body.style = "user-select: unset"
        drag = {
            ...drag,
            dragging: false
        }
    }

    const getCoords = elem => {
        const { top, right, bottom, left } = elem.getBoundingClientRect()
        return {
            top, 
            right, 
            bottom, 
            left
        }
    }

    const overlayCheck = append => {
        const elements = area.querySelectorAll(targetsQuery);
        const { top, right, bottom, left } = getCoords(container)

        for (let i = 0; i < elements.length; ++i) {
            const element = elements[i]

            const { top: eTop, right: eRight, bottom: eBottom, left: eLeft } = getCoords(element)
            const isOverlapping = !(
                right < eLeft ||
                left > eRight ||
                bottom < eTop ||
                top > eBottom
            )

            if(isOverlapping){
                emit("select", { element, index: i })
            } else if(!append) {
                emit("deselect", { element, index: i })
            }
        }
    }

    let container
    const updateSelect = append => {
        if(!container || !drag.dragging) return
        container.style.top = Math.min(drag.y1, drag.y2) + "px"
        container.style.left = Math.min(drag.x1, drag.x2) + "px"
        container.style.width = Math.abs(drag.x1 - drag.x2) + "px"
        container.style.height = Math.abs(drag.y1 - drag.y2) + "px"
        overlayCheck(append)
    }

    const updateSelectScroll = _ => {
        const scroll = { x: window.scrollX, y: window.scrollY }
        const prev = drag.scroll
        
        drag.x1 = drag.x1 + (prev.x - scroll.x)
        drag.y1 = drag.y1 + (prev.y - scroll.y)
        drag.scroll = scroll

        updateSelect(true)
    }
</script>

<svelte:window on:scroll={updateSelectScroll} />
<svelte:body on:mouseup={endDrag} on:mousedown={startDrag} on:mousemove={moveDrag} />

{#if drag.dragging && enabled}
    <div class="container" bind:this={container}></div>
{/if}

<div bind:this={area} class="area">
    <slot></slot>
</div>

<style>
    .container {
        top: -2px;
        left: -2px;
        position: fixed;
        background: rgba(21, 79, 255, 0.15);
        outline: 2px solid rgba(21, 79, 255, 0.7);
        z-index: 9999999
    }
</style>
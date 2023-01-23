<script>
    import { tick } from "svelte";


	export let title = '';
	let isHovered = false;
	let x;
	let y;
	let parent;
	let tooltip

	const newCoordSystem = (tooltip) => {
		let parent = tooltip.parentNode;
		if(parent.tagName === "BODY") return false

		if (getComputedStyle(parent).transform !== 'none') {
			return true
		} else {
			return newCoordSystem(parent);
		}
	}

	const calculatePosition = async ({ pageX, pageY, offset }) => {
		await tick()
		if(!tooltip) return [x, y]
		
		const bounding  = parent.getBoundingClientRect()
		const center = bounding.left + (bounding.width / 2)
		const centerPosition = center - (tooltip.clientWidth / 2)
		const left = centerPosition + tooltip.clientWidth > window.innerWidth ? centerPosition - (centerPosition + tooltip.clientWidth - window.innerWidth + 16) : centerPosition
		return [left, bounding.top - tooltip.clientHeight - 10 - offset]
	}
	
	function mouseOver(event) {
		isHovered = true;
		calculatePosition({pageX: event.pageX, pageY: event.pageY, offset: 0}).then(([nx, ny]) => (x = nx, y = ny))
	}

	function mouseLeave() {
		isHovered = false;
	}

	$: tooltip && document.body.appendChild(tooltip)
</script>

<div
	bind:this={parent}
	on:mouseover={mouseOver}
  	on:mouseleave={mouseLeave}
>
	<slot />
</div>

{#if isHovered}
	<div bind:this={tooltip} style="top: {y}px; left: {x}px;" class="tooltip">{title}</div>
{/if}

<style>
	.tooltip {
		border: 1px solid var(--l-grey);
		box-shadow: 5px 5px 15px rgba(0, 0, 0, .08);
		background: white;
		border-radius: 4px;
		padding: .4rem .6rem;
		position: fixed;
		font-size: .9rem;
		color: var(--grey);
		z-index: 2147483647;
	}
</style>
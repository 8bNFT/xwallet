<script>
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

	const calculatePosition = ({ pageX, pageY, offset }) => {
		if(!tooltip) return [x, y]

		const isNewCoord = newCoordSystem(tooltip)

		const bounding  = isNewCoord ? parent.getBoundingClientRect() : {x: 0, y: 0}
		let newX = Math.min(pageX - bounding.x - window.scrollX + (isNewCoord ? parent.offsetLeft : 0) - 10, window.innerWidth - bounding.x - tooltip.clientWidth)
		let newY = Math.min(pageY - bounding.y - window.scrollY + (isNewCoord ? parent.offsetTop  : 0) - tooltip.clientHeight - 10, window.innerHeight - bounding.y - tooltip.clientHeight)

		return [newX, newY]
	}
	
	function mouseOver(event) {
		isHovered = true;
		[x, y] = calculatePosition({pageX: event.pageX, pageY: event.pageY, offset: 0})
	}

	function mouseMove(event) {
		[x, y] = calculatePosition({pageX: event.pageX, pageY: event.pageY, offset: 0})
	}

	function mouseLeave() {
		isHovered = false;
	}
</script>

<div
	bind:this={parent}
	on:mouseover={mouseOver}
  	on:mouseleave={mouseLeave}
	on:mousemove={mouseMove}>
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
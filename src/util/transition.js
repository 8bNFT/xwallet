import { cubicOut } from "svelte/easing"

export function heightOut(node, {
	delay = 0,
	duration = 400,
	easing = cubicOut
}) {
    const style = getComputedStyle(node);
	const target_opacity = +style.opacity;
	const od = target_opacity * 1;
    const height = node.clientHeight

	return {
		delay,
		duration,
		easing,
		css: (t, u) => `
            height: ${height * t}px; 
            opacity: ${target_opacity - (od * u)}`
        
	};
}


export function heightIn(node, {
	delay = 0,
	duration = 400,
	easing = cubicOut
}) {
    const style = getComputedStyle(node);
	const target_opacity = +style.opacity;
	const od = target_opacity * 1;
    const height = node.clientHeight

    const currentHeight = ((node.previousElementSibling || node.nextElementSibling)?.clientHeight || 1) / height 

	return {
		delay,
		duration,
		easing,
		css: (t, u) => `
            height: ${height * Math.min(Math.max(t, currentHeight), 1)}px; 
            opacity: ${target_opacity - (od * u)}`
        
	};
}

export function flyOut(node, {
	delay = 0,
	duration = 400,
	easing = cubicOut,
	x = 0,
	y = 0,
	opacity = 0
}) {
	const style = getComputedStyle(node);
	const target_opacity = +style.opacity;
	const transform = style.transform === 'none' ? '' : style.transform;

	const od = target_opacity * (1 - opacity);
    const height = node.clientHeight

	return {
		delay,
		duration,
		easing,
		css: (t, u) => `
            height: ${height * t}px;
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        
	};
}

export function flyIn(node, {
	delay = 0,
	duration = 400,
	easing = cubicOut,
	x = 0,
	y = 0,
	opacity = 0
}) {
	const style = getComputedStyle(node);
	const target_opacity = +style.opacity;
	const transform = style.transform === 'none' ? '' : style.transform;

	const od = target_opacity * (1 - opacity);
    const height = node.clientHeight

    const currentHeight = ((node.previousElementSibling || node.nextElementSibling)?.clientHeight || 1) / height

	return {
		delay,
		duration,
		easing,
		css: (t, u) => `
            height: ${height * Math.min(Math.max(t, currentHeight), 1)}px;
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        
	};
}
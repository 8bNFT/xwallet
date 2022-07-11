<script>
    export let type, config, defaultConfig, current, max

    import Button from '@/comps/button.svelte';

    $: text = config.text || defaultConfig.text
    $: action = config.action || defaultConfig.action
</script>

<Button action={action({current, max})} {type} text={typeof text === "string" ? text : typeof text === "function" ? text({current, max}) : ""} />
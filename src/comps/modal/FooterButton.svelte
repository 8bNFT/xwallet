<script>
    export let type, config, defaultConfig, current, max, disabled

    import Button from 'src/comps/Button.svelte';

    $: text = config.text || defaultConfig.text
    $: action = config.action || defaultConfig.action
</script>

<Button {disabled} action={action({current, max})} {type} text={typeof text === "string" ? text : typeof text === "function" ? text({current, max}) : ""} />
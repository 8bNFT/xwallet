<script>
    export let type, config, defaultConfig, current, max, disabled, loading

    import Button from '@/comps/Button.svelte';

    $: text = config.text || defaultConfig.text
    $: action = config.action || defaultConfig.action
</script>

<Button disabled={disabled || loading} action={action({current, max})} {type} text={loading ? loading : typeof text === "string" ? text : typeof text === "function" ? text({current, max}) : ""} />
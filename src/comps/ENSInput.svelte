<script>
    export let value, valid, error, label, placeholder = ""

    import { sliceAddress, debounce } from "src/util/generic";
    import BasicInput from "./BasicInput.svelte";
    import { ToastStore } from "src/stores/toast";
    import { resolveENSDomain } from "src/util/blockchain";

    let disabled
    let info

    const fetchENSAddress = async domain => {
        try{
            return await resolveENSDomain(domain)
        }catch{
            return false
        }
    }

    const resolveENS = async d => {
        const domain = d
        if(!domain.endsWith(".eth") || domain.includes(" ")) return

        ToastStore.info("Resolving ETH address for " + domain)

        disabled = "true"
        info = "Resolving " + domain
        error = ""

        const address = await fetchENSAddress(domain)
        if(!address){
            ToastStore.error(domain + " does not resolve to an ETH address")
            info = ""
            error = domain + " does not resolve to an ETH address"
            disabled = null
            return
        }

        if(domain !== value) return

        ToastStore.success(domain + " resolves to " + sliceAddress(address))
        value = address
        disabled = null
        info = ""
    }

    const processENS = debounce(resolveENS, 500)

    $: processENS(value)
</script>

<BasicInput {placeholder} {label} bind:value {valid} {info} {error} {disabled} />
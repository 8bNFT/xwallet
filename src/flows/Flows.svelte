<script>
    import { FlowStore } from 'src/stores/generics';    
    import Transfer from './transfer/Transfer.svelte'
    import Deposit from './deposit/Deposit.svelte';

    const flows = {
        "transfer": Transfer,
        "deposit": Deposit
    }
</script>

{#if $FlowStore.flow}
    <svelte:component this={flows[$FlowStore.flow]} {...($FlowStore.props || {})} />
{/if}
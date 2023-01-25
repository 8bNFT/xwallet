<script>
    import { FlowStore } from "src/stores/flows";
    import Transfer from './transfer/Transfer.svelte'
    import Deposit from './deposit/Deposit.svelte';
    import Onramp from './onramp/Onramp.svelte';
    import Offramp from './offramp/Offramp.svelte';
    import Coin from './coin/Coin.svelte';
    import Withdrawal from './withdrawal/Withdrawal.svelte';
    import DepositNft from './deposit_nft/DepositNft.svelte';
    import TransferNft from './transfer_nft/TransferNft.svelte'

    const flows = {
        "transfer": Transfer,
        "deposit": Deposit,
        "buy": Onramp,
        "sell": Offramp,
        "coin": Coin,
        "withdraw": Withdrawal,
        "depositNFT": DepositNft,
        "transferNFT": TransferNft
    }
</script>

{#if $FlowStore.flow}
    <svelte:component this={flows[$FlowStore.flow]} {...($FlowStore.props || {})} />
{/if}
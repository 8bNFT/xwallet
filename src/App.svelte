<script>
  import { Wallet } from 'src/stores/wallet';
  import Flows from './flows/Flows.svelte';
  import Navigation from './comps/Navigation.svelte';
  import BalanceBanner from './comps/BalanceBanner.svelte';
  import EventHistory from './comps/history/EventHistory.svelte';
  import { generateFakeBalances } from './util/generic';

  let defaultBalances = []

  const walletPromise = Wallet.initialize("testnet")
  $: User = $Wallet.User
  $: defaultBalances = generateFakeBalances($Wallet.tokens)
</script>


<Navigation />
<div style="margin: 2rem .5rem">
{#await walletPromise}
  Initializing wallet
  <!-- Skeleton loader -->
{:then _} 
  <BalanceBanner defaultBalances={User && $User !== false ? [] : defaultBalances} />
  <EventHistory />
  <Flows />
{/await}
</div>
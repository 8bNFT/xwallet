<script>
  import { Wallet } from 'src/stores/wallet';
  import Flows from './flows/Flows.svelte';
  import Navigation from './comps/Navigation.svelte';
  import BalanceBanner from './comps/BalanceBanner.svelte';
  import EventHistory from './comps/history/EventHistory.svelte';
  import { generateFakeBalances } from './util/generic';
  import EventSkeleton from './comps/skeleton/EventSkeleton.svelte';
  import BalanceSkeleton from './comps/skeleton/BalanceSkeleton.svelte';

  let defaultBalances = []

  const currentNetwork = window.location.hostname === "localhost" || window.location.href.includes("goerli") || window.location.href.includes("testnet") ? "testnet" : "mainnet"
  const walletPromise = Wallet.initialize(currentNetwork)
  
  $: User = $Wallet.User
  $: defaultBalances = generateFakeBalances($Wallet.tokens)
</script>


<Navigation />
<div style="margin: 2rem .5rem">
{#await walletPromise}
  <BalanceSkeleton />
  <EventSkeleton />
{:then _} 
  <BalanceBanner defaultBalances={User && $User !== false ? [] : defaultBalances} />
  <EventHistory />
  <Flows />
{/await}
</div>
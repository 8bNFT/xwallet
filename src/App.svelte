<script>
  import Router from "svelte-spa-router";
  import { Wallet } from 'src/stores/wallet';
  import Navigation from 'src/comps/Navigation.svelte';
  import Skeleton from "src/pages/Skeleton.svelte";
  import { routes } from "src/routes"
  import BalanceBanner from "src/comps/BalanceBanner.svelte";
  import Flows from "./flows/Flows.svelte";
  import MaxWidth from "./comps/MaxWidth.svelte";
  import ToastHolder from "./comps/toast/ToastHolder.svelte";
  import { getWalletNetwork } from "./util/generic";

  const currentNetwork = getWalletNetwork()
  const walletPromise = Wallet.initialize(currentNetwork)
</script>

<Flows />
<ToastHolder />

<MaxWidth>
  <Navigation />
  <div style="margin: 2rem .5rem">
  {#await walletPromise}
    <Skeleton />
  {:then _}
    <BalanceBanner />
    <Router {routes} />
  {/await}
  </div>
</MaxWidth>
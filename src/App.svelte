<script>
  import Router from "svelte-spa-router";
  import { Wallet, User, tokens } from 'src/stores/wallet';
  import Navigation from 'src/comps/Navigation.svelte';
  import Skeleton from "src/pages/Skeleton.svelte";
  import { routes } from "src/routes"

  import { generateFakeBalances } from "src/util/generic";
  import BalanceBanner from "src/comps/BalanceBanner.svelte";
  import Flows from "./flows/Flows.svelte";
  import MaxWidth from "./comps/MaxWidth.svelte";

  const currentNetwork = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.href.includes("goerli") || window.location.href.includes("testnet") ? "testnet" : "mainnet"
  const walletPromise = Wallet.initialize(currentNetwork)

  let defaultBalances = []

  $: defaultBalances = $User ? [] : generateFakeBalances(tokens)
</script>

<Flows />

<MaxWidth>
  <Navigation />
  <div style="margin: 2rem .5rem">
  {#await walletPromise}
    <Skeleton />
  {:then _}
    <BalanceBanner {defaultBalances} />
    <Router {routes} />
  {/await}
  </div>
</MaxWidth>
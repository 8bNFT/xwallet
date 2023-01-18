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
  import { WalletManager } from "./wallets/signer_handler";

  const currentNetwork = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.href.includes("goerli") || window.location.href.includes("testnet") ? "testnet" : "mainnet"
  const walletPromise = Wallet.initialize(currentNetwork)

  let defaultBalances = []

  const walletManager = new WalletManager(currentNetwork)

  const mm = walletManager.getWallet("METAMASK")

  const log = fn => async () => console.log(await fn.call(mm))

  $: defaultBalances = $User ? [] : generateFakeBalances(tokens)
</script>

<Flows />

<MaxWidth>
  <Navigation />
  <div style="margin: 2rem .5rem">
  {#await walletPromise}
    <Skeleton />
  {:then _}
    <button on:click={log(mm.isAvailable)}>Check if available</button>
    <button on:click={log(mm.checkExistingSession)}>Check existing session</button>
    <button on:click={log(mm.login)}>Log in to a wallet</button>
    <button on:click={log(mm.logout)}>"Log out" from a wallet</button>

    <BalanceBanner {defaultBalances} />
    <Router {routes} />
  {/await}
  </div>
</MaxWidth>
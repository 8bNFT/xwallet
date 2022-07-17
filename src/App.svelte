<script>
  import { Wallet } from 'src/stores/wallet';
  import Flows from './flows/Flows.svelte';
  import BalanceBanner from './comps/BalanceBanner.svelte';
  import EventHistory from './comps/history/EventHistory.svelte';

  const walletPromise = Wallet.initialize("mainnet")
  $: User = $Wallet.User
</script>

{#await walletPromise}
  Initializing wallet
{:then _} 
  <!-- <img width="440" src="https://images.unsplash.com/photo-1657574032013-000240e25a91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80" /> -->

  {#if Wallet.isInitialized()}
    {#if $User !== false}
      <div style="margin: 2rem .5rem">
        <BalanceBanner />

        <EventHistory />

        <Flows />
        <!-- {#each Object.values($Balances) as asset}
          <div>{asset.balance.parsed} {asset.symbol} (${assetToUSD(asset.balance.parsed, asset.price)})</div>
        {/each} -->

        <!-- {fetchBalance()} -->

        <!-- {#await balance}
          Loading FCT balance
        {:then _b}
          {_b}
        {/await} -->

        <!-- {$User.address}  -->
        <!-- <Tooltip title="Disconnect your wallet"> -->
          <!-- <button on:click={User.logout}>Disconnect</button> -->
        <!-- </Tooltip> -->
        <button on:click={User.logout}>Disconnect</button>
      </div>
    {:else}
      <button on:click={User.login}>Log in</button>
    {/if}
  {/if}
{/await}
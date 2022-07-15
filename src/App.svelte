<script>
  import { Wallet } from 'src/stores/wallet';
  import Transfer from 'src/flows/transfer/Transfer.svelte';
  import { assetToUSD } from './util/cfx';
  import Tooltip from 'src/comps/Tooltip.svelte';
  import { getERC20Balance } from './util/blockchain';
  import Deposit from './flows/deposit/Deposit.svelte';

  const walletPromise = Wallet.initialize("testnet")

  let balance = new Promise(()=>{})

  const fetchBalance = () => balance = getERC20Balance({ wallet: $User.address, token: $Balances["0x73f99ca65b1a0aef2d4591b1b543d789860851bf"] })

  $: User = $Wallet.User
  $: Balances = $Wallet.Balances
</script>

{#await walletPromise}
  Initializing wallet
{:then _} 
  <img width="440" src="https://images.unsplash.com/photo-1657574032013-000240e25a91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80" />
  
  {#if $User !== false && $Balances !== false}
    <div style="margin: 2rem">
      {#each Object.values($Balances) as asset}
        <div>{asset.balance.parsed} {asset.symbol} (${assetToUSD(asset.balance.parsed, asset.price)})</div>
      {/each}

      <!-- {fetchBalance()} -->

      <!-- {#await balance}
        Loading FCT balance
      {:then _b}
        {_b}
      {/await} -->

      <!-- <Transfer /> -->

      <Deposit />
      {$User.address} 
      <Tooltip title="Disconnect your wallet">
        <button on:click={User.logout}>Disconnect</button>
      </Tooltip>
    </div>
  {:else}
    <button on:click={$Wallet.User.login}>Log in</button>
  {/if}
{/await}

<style>
</style>
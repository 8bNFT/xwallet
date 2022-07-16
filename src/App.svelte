<script>
  import { Wallet } from 'src/stores/wallet';
  import Transfer from 'src/flows/transfer/Transfer.svelte';
  import { assetToUSD, formatCryptoDisplay, formatFiatDisplay } from './util/cfx';
  import Deposit from './flows/deposit/Deposit.svelte';
  import { createGenericStore } from './stores/payload';

  const walletPromise = Wallet.initialize("mainnet")
  const flowStore = createGenericStore({ flow: false, props: {} })
  let totalBalance = 0

  const calculateBalance = balances => {
    let total = 0
    for(let asset of Object.values(balances)){
      if(asset.balance.parsed <= 0 || !asset.price) continue
      total += Number(assetToUSD(asset.balance.parsed, asset.price))
    }

    return total
  }

  $: User = $Wallet.User
  $: Balances = $Wallet.Balances
  $: totalBalance = typeof $Balances === "object" ? calculateBalance($Balances) : 0
</script>

{#await walletPromise}
  Initializing wallet
{:then _} 
  <!-- <img width="440" src="https://images.unsplash.com/photo-1657574032013-000240e25a91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80" /> -->

  {#if $User !== false && typeof $Balances === "object"}
    <div style="margin: 2rem .5rem">
      <div class="banner">
        <div class="balance">
          <div class="subtitle">Balance</div>
          <h1 class="balance--total">{formatFiatDisplay(totalBalance)}</h1>
          <div>
            <Transfer />
            <Deposit />
          </div>
        </div>
        <div class="balances">
          {#each Object.values($Balances).sort((a, b) => a.name.localeCompare(b.name)) as asset}
            {#if [asset.balance, asset.preparing_withdrawal, asset.withdrawable].some(v => v.parsed > 0)}
              <div class="asset">
                <div class="info">
                  <img class="icon" alt={`${asset.name} icon`} src={asset.image_url || "https://design-system.immutable.com/currency_icons/currency--erc20.svg"} on:error={(e) => e.target.src = "https://design-system.immutable.com/currency_icons/currency--erc20.svg"} />
                  <span class="name">
                    {asset.name}
                  </span>
                  {#if asset.change}
                    <span class="change" class:negative={asset.change["1d"] < 0}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8.627 5.348">
                        <g id="Icon_feather-trending-up" data-name="Icon feather-trending-up" transform="translate(-0.793 -8.293)">
                          <path id="Path_14" data-name="Path 14" d="M8.712,9,5.6,12.114,3.959,10.475,1.5,12.934" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
                          <path id="Path_15" data-name="Path 15" d="M25.5,9h1.967v1.967" transform="translate(-18.755)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
                        </g>
                      </svg>
                      <span>
                        {asset.change["1d"]}%
                      </span>            
                    </span>
                  {/if}
                </div>

                <div class="amount">
                  <div class="crypto">
                    {formatCryptoDisplay(asset.balance.parsed)}
                  </div>
                  <div class="fiat">
                    {formatFiatDisplay(assetToUSD(asset.balance.parsed, asset.price))}
                  </div>
                </div>
              </div>
            {/if}
          {/each}
        </div>
      </div>

      <!-- {#each Object.values($Balances) as asset}
        <div>{asset.balance.parsed} {asset.symbol} (${assetToUSD(asset.balance.parsed, asset.price)})</div>
      {/each} -->

      <!-- {fetchBalance()} -->

      <!-- {#await balance}
        Loading FCT balance
      {:then _b}
        {_b}
      {/await} -->

      {$User.address} 
      <!-- <Tooltip title="Disconnect your wallet"> -->
        <button on:click={User.logout}>Disconnect</button>
      <!-- </Tooltip> -->
    </div>
  {:else}
    <button on:click={$Wallet.User.login}>Log in</button>
  {/if}
{/await}

<style>
  .banner {
    width: 100%;
    max-width: 1040px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: auto;
    gap: 4rem;
    position: relative;
    align-items: flex-start;
    margin-bottom: 3rem
  }

  .balance {
    grid-column: 1 / span 2;
    grid-row: 1;
    background: var(--l-grey);
    border-radius: 18px;
    padding: 2rem;
  }

  .subtitle {
    color: var(--grey);
    margin-bottom: .25rem;
    font-size: 1.1rem;
    font-weight: 300
  }

  .balance--total {
    font-size: 2.1rem;
    margin: 0;
    margin-bottom: 1.75rem;
    font-weight: 600
  }

  .balances {
    margin-top: 2rem;
    margin-left: -2rem;
    width: 100%;
    padding: .5rem .1rem;
    grid-column: 2;
    grid-row: 1;
    background: white;
    border-radius: 8px;
    box-shadow: 0 0 20px  rgba(0, 0, 0, .044);
  }

  @media screen and (max-width: 900px){
    .banner {
      gap: 0;
      grid-template-columns: 1fr;
    }

    .balance {
      grid-column: 1;
      padding-bottom: 4rem;
    }

    .balances {
      width: auto;
      grid-column: 1;
      grid-row: 2;
      margin: 0 1rem;
      margin-top: -2rem;
    }
  }

  .asset {
    display: flex;
    align-items: flex-top;
    justify-content: space-between;
    padding: .25rem .5rem;
    margin: .35rem;
    border-radius: 6px;
    transition: background-color .2s;
    cursor: pointer
  }

  .asset:hover {
    background-color: var(--l-grey);
  }

  .asset .info {
    display: flex;
    align-items: center;
  }

  .amount {
    text-align: right
  }

  .amount .crypto {
    font-weight: 500;
    font-size: .95em;
    margin-bottom: .1em
  }

  .amount .fiat {
    font-size: .8em;
    color: var(--grey)
  }

  .icon {
    height: 1.3em;
    width: 1.3em;
    display: block;
    margin-right: .5rem
  }

  .change {
    margin-left: .5rem;
    display: flex;
    align-items: center;
    font-size: .6em;
    padding: .45em;
    background: #ECF9F4;
    border-radius: 3px;
    color: #279B80;
    font-weight: 600
  }

  .change.negative {
    color: #dd0909;
    background: #fdeaea;
  }

  .change.negative svg {
    transform: scaleY(-1)
  }

  .change svg {
    height: .7em;
    margin-right: .4em
  }
</style>
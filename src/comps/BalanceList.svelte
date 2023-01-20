<script>
  import { FlowStore, WalletDropdown } from "src/stores/generics";
  import { Balances, tokens, User } from "src/stores/wallet";
  import { formatCryptoDisplay, formatFiatDisplay, assetToUSD } from "src/util/cfx";
  import { DEFAULT_TOKEN_ICON, generateFakeBalances } from "src/util/generic";
  import PriceChange from "./PriceChange.svelte";
  import Tooltip from "./Tooltip.svelte";

  $: defaultBalances = $User ? [] : generateFakeBalances(tokens)
</script>

<div class="balances">
    {#each Object.values($Balances || defaultBalances || {}).sort((a, b) => a.name.localeCompare(b.name)) as asset}
        {#if [asset.balance, asset.preparing_withdrawal, asset.withdrawable].some(v => v.parsed > 0)}
            <div on:click={() => $Balances ? FlowStore.coinInformation(asset.id) : null} class="asset">
                <div class="info">
                <img class="icon" alt={`${asset.name} icon`} src={asset.image_url || DEFAULT_TOKEN_ICON} on:error={(e) => e.target.src = DEFAULT_TOKEN_ICON} />
                <span class="name">
                    {asset.name}
                </span>
                {#if asset.change}
                  <Tooltip title={formatFiatDisplay(asset.price)}>
                    <PriceChange change={asset.change} />
                  </Tooltip>
                {/if}
                </div>
                <div class="amount">
                  <div class="crypto">
                    {#if $Balances}
                      {formatCryptoDisplay(asset.balance.parsed)}
                    {:else}
                      0.00
                    {/if}
                  </div>
                  <div class="fiat">
                      {formatFiatDisplay(assetToUSD($Balances ? asset.balance.parsed : 1, asset.price))}
                  </div>
                </div>
            </div>
        {/if}
    {/each}
    <div data-dropdown-toggle={$Balances === false} on:click={() => $Balances ? FlowStore.deposit() : WalletDropdown.open()} class="asset deposit">
      <div class="info">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.045 9.045"><g id="Icon_feather-plus" data-name="Icon feather-plus" transform="translate(1 1)"><path id="Path_6" data-name="Path 6" d="M18,7.5v7.045" transform="translate(-14.477 -7.5)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path id="Path_7" data-name="Path 7" d="M7.5,18h7.045" transform="translate(-7.5 -14.477)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></svg>
        <span class="name">
          {#if $Balances}
            Deposit a token
          {:else}
            Connect wallet
          {/if}
        </span>
      </div>
  </div>
</div>

<style>
  .balances {
      margin-top: 2rem;
      margin-left: -2rem;
      width: 100%;
      padding: .1rem;
      grid-column: 2;
      grid-row: 1;
      background: white;
      border-radius: 8px;
      box-shadow: 0 0 20px  rgba(0, 0, 0, .044)
  }

  @media screen and (max-width: 900px){   
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
    align-items: center;
    justify-content: space-between;
    padding: .35rem .5rem;
    margin: .2rem;
    border-radius: 6px;
    transition: background-color .2s;
    cursor: pointer
  }

  .asset:hover {
    background-color: var(--l-grey);
  }

  @media screen and (max-width: 500px){   
    .asset {
      flex-direction: column;
      align-items: flex-start;
      padding: .5rem;
    }
    
    .asset .amount {
      padding-left: 1.8rem;
      text-align: left;
      margin-top: .3rem
    }

    .asset.deposit {
      align-items: center;
    }
  }

  .asset.deposit {
    justify-self: center;
    padding: .75rem .5rem;
    justify-content: center;
    font-size: .9rem;
    background: var(--l-grey);
  }

  .asset.deposit:not(:first-child) {
    margin-top: .75rem
  }

  .asset.deposit:hover {
    background: #e0e0e0;
  }

  .asset.deposit .icon {
    height: .8em;
    width: .8em
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
</style>
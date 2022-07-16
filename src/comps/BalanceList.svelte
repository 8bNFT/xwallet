<script>
    import { FlowStore } from "src/stores/generics";
    import { Balances } from "src/stores/wallet";
    import { formatCryptoDisplay, formatFiatDisplay, assetToUSD } from "src/util/cfx";
</script>

<div class="balances">
    {#each Object.values($Balances).sort((a, b) => a.name.localeCompare(b.name)) as asset}
        {#if [asset.balance, asset.preparing_withdrawal, asset.withdrawable].some(v => v.parsed > 0)}
            <div on:click={() => FlowStore.transfer(asset.id)} class="asset">
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
    <div on:click={() => FlowStore.deposit()} class="asset deposit">
      <div class="info">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.045 9.045"><g id="Icon_feather-plus" data-name="Icon feather-plus" transform="translate(1 1)"><path id="Path_6" data-name="Path 6" d="M18,7.5v7.045" transform="translate(-14.477 -7.5)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path id="Path_7" data-name="Path 7" d="M7.5,18h7.045" transform="translate(-7.5 -14.477)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></svg>
        <span class="name">
            Deposit a token
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
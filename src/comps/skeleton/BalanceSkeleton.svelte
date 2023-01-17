<script>
  import Icon from "./Icon.svelte";
  import Text from "./Text.svelte";
  import BannerButton from "src/comps/FlowButton.svelte"
  import { randomInt } from "src/util/generic";
</script>

<div class="banner">
    <div class="balance">
        <div class="w-50">
            <div class="subtitle">Balance</div>
            <h1 class="balance--total"><Text w={"9rem"} /></h1>
            <div class="buttons">
                <BannerButton disabled value="Send" />
                <BannerButton disabled value="Receive" />
                <BannerButton disabled value="Deposit" />
                <BannerButton disabled value="Withdraw" />
                <BannerButton disabled value="Buy" />
                <BannerButton disabled value="Sell" />
            </div>
        </div>
    </div>

    <div class="balances">
        {#each new Array(5) as _}
            <div class="asset">
                <div class="info">
                    <div class="icon"><Icon /></div>
                    <span class="name">
                        <Text w={4 + randomInt(4) + "rem"} />
                    </span>
                </div>
                <div class="amount">
                    <div class="crypto">
                        <Text w={2 + randomInt(2) + "rem"} />
                    </div>
                    <div class="fiat">
                        <Text w={3 + randomInt(3) + "rem"} />
                    </div>
                </div>
            </div>
        {/each}
        <div class="asset deposit">
          <div class="info">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.045 9.045"><g id="Icon_feather-plus" data-name="Icon feather-plus" transform="translate(1 1)"><path id="Path_6" data-name="Path 6" d="M18,7.5v7.045" transform="translate(-14.477 -7.5)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path id="Path_7" data-name="Path 7" d="M7.5,18h7.045" transform="translate(-7.5 -14.477)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></svg>
            <span class="name">
              Loading wallet...
            </span>
          </div>
      </div>
    </div>
</div>

<style>
  .banner {
    display: grid;
    grid-template-columns: 1fr 1fr;
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
    padding: 2rem
  }

  .w-50 {
    width: calc(50% - 2rem);
  }

  @media screen and (max-width: 900px){
      .banner {
        gap: 0;
        grid-template-columns: 1fr;
      }

      .w-50 {
        width: 100%;
      }

      .balance {
        grid-column: 1;
        padding-bottom: 4rem;
        display: flex;
        justify-items: center;
      }
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

  .buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .5rem;
    max-width: 300px;
  }

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
    pointer-events: none;
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

  .asset.deposit .icon {
    height: .8em;
    width: .8em
  }

  .asset .info {
    display: flex;
    align-items: center;
  }

  .amount {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .fiat {
    font-size: .8rem;
    margin-top: .3rem
  }

  .icon {
    height: 1.3em;
    width: 1.3em;
    display: block;
    margin-right: .5rem;
    border-radius: 2rem;
    overflow: hidden;
  }
</style>
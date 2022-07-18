<script>
    export let defaultBalances

    import { FlowStore } from "src/stores/generics";
    import { Balances, Wallet, User } from "src/stores/wallet";
    import { formatFiatDisplay, assetToUSD } from "src/util/cfx";
    import { filterOfframpTokens } from "src/util/imx";
    import BalanceList from "./BalanceList.svelte";
    import BannerButton from "./FlowButton.svelte";

    let totalBalance = 0

    const calculateBalance = balances => {
        if(!$Balances) return 0

        let total = 0
        for(let asset of Object.values(balances)){
            if(asset.balance.parsed <= 0 || !asset.price) continue
            total += Number(assetToUSD(asset.balance.parsed, asset.price))
        }

        return total
    }
    
    $: totalBalance = calculateBalance($User ? $Balances : defaultBalances)
</script>

<div class="banner">
    <div class="balance">
        <div class="w-50">
            <div class="subtitle">Balance</div>
            <h1 class="balance--total">{formatFiatDisplay(totalBalance)}</h1>
            <div class="buttons">
                <BannerButton disabled={$User === false || !Object.values($Balances).length} value="Send" on:click={() => FlowStore.set({ flow: "transfer", props: {} })} />
                <BannerButton disabled value="Receive" />
                <BannerButton disabled={$User === false} value="Deposit" on:click={() => FlowStore.deposit()} />
                <BannerButton disabled={$User === false || !Object.values($Balances).length} value="Withdraw" on:click={() => FlowStore.set({ flow: "transfer", props: {} })} />
                <BannerButton disabled={$User === false} value="Buy" on:click={() => FlowStore.buy()} />
                <BannerButton disabled={$User === false || !$Balances || !Object.values(filterOfframpTokens($Balances, Wallet.getNetwork())).length} value="Sell" on:click={() => FlowStore.set({ flow: "sell", props: {} })} />
            </div>
        </div>
    </div>

    <BalanceList {defaultBalances} />
  </div>

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
</style>
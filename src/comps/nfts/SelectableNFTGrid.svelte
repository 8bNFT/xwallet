<script>
    export let nfts, store, selectable, status

    import Submenu from "../Submenu.svelte";
    import NFT from "./NFT.svelte"
    import { getEtherscanURL, getMarketplaceURL, NETWORKS } from "src/util/imx";
    import { Wallet } from "src/stores/wallet";
    import { FlowStore } from "src/stores/flows";

    let submenuTarget
    let options

    const { User } = $Wallet

    const createOptions = nft => {
        const options = [
            ...(nft.status === "imx" && [{text: "Transfer NFT", action: () => initSelect(nft) }] || []),
            ...(nft.status === "imx" && [{ text: "Withdraw NFT", action: () => FlowStore.withdrawNFT(nft) }] || []),
            ...(nft.status === "withdrawable" && [{ text: "Finalize NFT withdrawal", action: () => FlowStore.withdrawNFT(nft) }] || []),
            ...(nft.status === "eth" && [{ text: "Deposit NFT", action: () => FlowStore.depositNFT(nft) }] || []),
            ...[(nft.status === "eth" && Wallet.getNetwork() === NETWORKS.MAINNET) && { text: "View on Etherscan", action: () => window.open(`${getEtherscanURL()}/nft/${nft.token_address}/${nft.token_id}`, "_blank")} || { text: "View on Immutascan", action: () => window.open(`https://immutascan.io/address/${nft.token_address}/${nft.token_id}`, "_blank") }]
        ]
        return options
    }

    const initSelect = nft => {
        store.reset()
        store.select(nft)
        selectable = true
    }

    const openSubmenu = e => {
        const { target, nft } = e.detail
        if(submenuTarget === target) return submenuTarget = false

        options = createOptions(nft)
        submenuTarget = target
    }
</script>

<Submenu bind:target={submenuTarget} {options} />

<div class="grid">
    {#each nfts as nft}
        <NFT {nft} selected={selectable && nft.token_address in $store && store.contains(nft)} {selectable} on:click={selectable ? () => store.toggle(nft) : null} on:toggle={openSubmenu} />
    {:else}
        <div class="empty" style="text-align: center; padding: 3rem">
            <h3 style="font-weight: 500">Nothing to see here.. yet!</h3>
            {#if $User === false}
                <span class="note"><span on:click={User.connect} style="text-decoration:underline;cursor:pointer">Connect your wallet</span> in order to manage your NFTs</span>
            {:else}
                {#if status === "preparing_withdrawal"}
                    <span class="note">No NFTs are being prepared for withdrawal. If you initiated a withdrawal, check "Withdrawable".</span>
                {:else if status === "withdrawable"}
                    <span class="note">No NFTs are available for withdrawal. If you initiated a withdrawal, check "Preparing withdrawal".<br/>It can take up to 48h before your NFT becomes withdrawable.</span>
                {:else if status === "eth"}
                    <span class="note">It seems like you have no IMX-minted NFTs on L1. Good. All hail L2.</span>
                {:else}
                    <span class="note">It seems like you have no NFTs? Check out our <a href={getMarketplaceURL()} target="_blank">marketplace</a> to get some!</span>
                {/if}
            {/if}
        </div>
    {/each}
</div>

<style>
    .grid {
        padding-top: 8px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
    }

    .empty {
        grid-column: 1 / 5;
    }

    h3 {
        margin: 0;
        margin-bottom: .5rem
    }

    .note {
        font-size: .9rem;
        color: var(--grey)
    }
</style>
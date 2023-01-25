<script>
    export let nfts, store, selectable

    import Submenu from "../Submenu.svelte";
    import NFT from "./NFT.svelte"
    import { FlowStore } from "src/stores/flows";
    import { getEtherscanURL, NETWORKS } from "src/util/imx";
    import { Wallet } from "src/stores/wallet";

    let submenuTarget
    let options

    const createOptions = nft => {
        const options = [
            ...(nft.status === "imx" && [{text: "Transfer NFT", action: () => initSelect(nft) }] || []),
            ...(nft.status === "imx" && [{ text: "Withdraw NFT", action: () => initSelect(nft) }] || []),
            ...(nft.status === "withdrawable" && [{ text: "Finalize NFT withdrawal", action: () => initSelect(nft) }] || []),
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
        <h1>No NFTs brokie</h1>
    {/each}
</div>

<style>
    .grid {
        padding-top: 8px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
    }
</style>
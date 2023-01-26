<script>
    import { Wallet } from "src/stores/wallet"
    import { sliceAddress } from "src/util/generic"
    import Tooltip from "src/comps/Tooltip.svelte"
    import { fly } from "svelte/transition"
    import { link } from "svelte-spa-router"
    import active from 'svelte-spa-router/active'
    import { copyToClipboard } from "src/util/generic"
    import { WalletDropdown } from "src/stores/generics"
    import { getEtherscanURL, NETWORKS } from "src/util/imx";
    import { routesWithDetails } from "src/routes";

    let container

    const closeSubmenu = e => {
        if(!container || container.contains(e.target)) return
        WalletDropdown.close()
    }

    $: User = $Wallet.User
    $: WalletManager = $Wallet.Manager
    $: if(!User) WalletDropdown.close()
</script>

<svelte:window on:click={closeSubmenu} />

<nav>
    <!-- <img src="" alt="" class="logo"> -->
    <div class="logo">
        <a href="/" use:link>wallet<span class="accent">.</span></a>
    </div>
    <div class="links">
        <!-- {} -->
        {#each Object.entries(routesWithDetails) as [url, {name, hidden}]}
            {#if !hidden}
                <a use:active href={url} use:link>{name}</a>
            {/if}
        {/each}
    </div>
    {#if User}
        <div bind:this={container} class="container">
            {#if $User !== false}
                <div on:click={WalletDropdown.toggle} class="user">
                    <img src={`https://avatars.dicebear.com/api/adventurer-neutral/${$User.address}.svg`} alt="" class="avatar">
                    <div>
                        <div class="wallet_provider">
                            <div class="icon">
                                <img src={$User.wallet.getIcon()} />
                            </div>
                            <span class="name">
                                {$User.wallet.getName()}
                            </span>
                        </div>
                        <Tooltip title={$User.address}>
                            <span class="address">{sliceAddress($User.address)}</span>
                        </Tooltip>
                    </div>
                    {#if $WalletDropdown}
                        <div transition:fly|local={{y: 20}} class="submenu">
                            <span on:click={() => copyToClipboard($User.address, "your address")}>Copy address</span>
                            <a href={getEtherscanURL() + `/address/${$User.address}`} target="_blank">View on Etherscan</a>
                            <a href={`https://immutascan.io/address/${$User.address}`} target="_blank">View on Immutascan</a>
                            <span on:click={User.disconnect} class="destructive">Log out</span>
                        </div>
                    {/if}
                </div>
            {:else}
                <div on:click={WalletDropdown.toggle} class="login">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="31.5" viewBox="0 0 36 31.5">
                        <path id="Icon_open-account-login" data-name="Icon open-account-login" d="M13.5,0V4.5h18V27h-18v4.5H36V0ZM18,9v4.5H0V18H18v4.5l9-6.75Z"/>
                    </svg>                  
                    <span>Connect Wallet</span>
                    {#if $WalletDropdown}
                        <div transition:fly|local={{y: 20}} class="submenu">
                            {#each Object.entries($WalletManager.getAvailableWallets()) as [id, info]}   
                                <span class="wallet" on:click={() => $WalletManager.connect(id)}>
                                    <div class="icon">
                                        <img src={info.icon}>
                                    </div>
                                    <span class="name">{info.name}</span>
                                </span>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    {/if}
</nav>

<style>
    nav {
        display: grid;
        align-items: center;
        padding-top: 1rem;
        grid-template-columns: 20% 60% 20%;
    }

    .links {
        text-align: center;
        flex: 1;
    }

    .links a, .links a:visited {
        text-decoration: none;
        display: inline-block;
        margin: 0 .5rem;
        color: black;
        font-size: .95rem;
        font-weight: 500;
        opacity: .5;
        transition: opacity .15s
    }

    .links a:hover {
        opacity: 1
    }

    :global(.links a.active) {
        opacity: 1 !important;
    }

    .logo {
        user-select: none;
        font-weight: 700;
        font-size: 1.35rem;
    }

    .logo a {
        color: inherit;
        text-decoration: none;
    }

    .accent {
        color: var(--accent)
    }

    .user, .login, .container {
        user-select: none;
        margin-left: auto;
        display: flex;
        align-items: center;
        border-radius: 40px;
        padding: .5rem;
        padding-right: 1rem;
        transition: all .15s;
        cursor: pointer;
        position: relative
    }

    .user {
        font-size: .9rem
    }

    .wallet_provider {
        display: flex;
        font-size: .85em;
        color: var(--grey);
        margin-bottom: .2rem;
        align-items: center;
    }

    .wallet_provider .icon {
        height: 1.25em;
        width: 1.25em;
        margin-right: .5em;
        border-radius: 50%;
        overflow: hidden;
    }

    .login {
        padding: 1rem
    }

    .login svg {
        height: 1em;
        width: 1em;
        margin-right: .5em
    }

    .user:hover, .login:hover {
        background: var(--l-grey);
    }

    .avatar {
        height: 40px;
        width: 40px;
        border-radius: 20px;
        border: 4px solid white;
        margin-right: .5rem
    }

    .submenu {
        cursor: default;
        width: 100%;
        min-width: 200px;
        position: absolute;
        top: 100%;
        margin-top: .5rem;
        z-index: 11;
        background: white;
        border-radius: 4px;
        box-shadow: 0 0 20px rgba(0, 0, 0, .05);
        padding: .5rem;
        padding-bottom: .15rem;
        left: 50%;
        transform: translateX(-50%)
    }

    .submenu > span, .submenu a {
        display: block;
        text-decoration: none;
        font-size: .9rem;
        color: inherit;
        padding: .75rem;
        cursor: pointer;
        border-radius: 6px;
        margin-bottom: .35rem;
        transition: background-color .2s;
    }

    .submenu > span:hover, .submenu a:hover {
        background: var(--l-grey);
    }

    .submenu .destructive {
        color: #dd0909
    }

    .submenu .wallet {
        display: flex;
        align-items: center;
    }

    .wallet .icon {
        width: 1.25em;
        height: 1.25em;
        margin-right: .5rem
    }

    .icon img {
        max-width: 100%;
        object-fit: contain
    }
</style>
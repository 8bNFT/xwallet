<script>
    import { Wallet } from "src/stores/wallet"
    import { sliceAddress } from "src/util/generic"
    import Tooltip from "src/comps/Tooltip.svelte"
    import { fly } from "svelte/transition"

    let open = false
    let container

    const closeSubmenu = (e) => {
        if(!container || container.contains(e.target)) return
        open = false
    }

    const copyToClipboard = (e, address) => {
        if(!address) return

        navigator.clipboard.writeText(address)
        e.target.innerText = "Copied to clipboard!"
        setTimeout(() => e.target.innerText = "Copy address", 1000)
    }

    $: User = $Wallet.User
    $: if(!User || !$User) open = false
</script>

<svelte:window on:click={closeSubmenu} />

<nav>
    <!-- <img src="" alt="" class="logo"> -->
    <div class="logo">
        wallet<span class="accent">.</span>
    </div>
    <div class="links">
    </div>
    {#if User}
        {#if $User !== false}
            <div bind:this={container} on:click={() => open = !open} class="user">
                <img src={`https://avatars.dicebear.com/api/adventurer-neutral/${$User.address}.svg`} alt="" class="avatar">
                <Tooltip title={$User.address}>
                    <span class="address">{sliceAddress($User.address)}</span>
                </Tooltip>
                {#if open}
                <div transition:fly|local={{y: 20}} class="submenu">
                    <span on:click|stopPropagation={(e) => copyToClipboard(e, $User.address)}>Copy address</span>
                    <a href={`https://immutascan.io/address/${$User.address}`} target="_blank">View on Immutascan</a>
                    <span on:click={User.logout} class="destructive">Log out</span>
                </div>
                {/if}
            </div>
        {:else}
            <div on:click={User.login} class="login">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="31.5" viewBox="0 0 36 31.5">
                    <path id="Icon_open-account-login" data-name="Icon open-account-login" d="M13.5,0V4.5h18V27h-18v4.5H36V0ZM18,9v4.5H0V18H18v4.5l9-6.75Z"/>
                </svg>                  
                <span>Connect Wallet</span>
            </div>
        {/if}
    {/if}
</nav>

<style>
    nav {
        max-width: 1040px;
        margin: auto;
        display: flex;
        align-items: center;
        margin-top: 1rem;
        /* justify-content: space-between; */
    }

    .logo {
        user-select: none;
        cursor: pointer;
        font-weight: 700;
        font-size: 1.35rem
    }

    .accent {
        color: var(--accent)
    }

    .user, .login {
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

    .submenu span, .submenu a {
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

    .submenu span:hover, .submenu a:hover {
        background: var(--l-grey);
    }

    .submenu .destructive {
        color: #dd0909
    }
</style>
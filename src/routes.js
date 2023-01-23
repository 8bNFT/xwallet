import ERC20s from "./pages/ERC20s.svelte"
import NFTs from "./pages/NFTs.svelte"

export const routesWithDetails = {
    '/': {
        component: ERC20s,
        name: "Home",
    },
    '/inventory': {
        component: NFTs,
        name: "Inventory"
    }
}

export const routes = Object.entries(routesWithDetails).reduce((acc, [url, v]) => ({...acc, [url]: v.component}), {})
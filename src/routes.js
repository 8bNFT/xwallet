import Dashboard from "./pages/Dashboard.svelte"
import NFTs from "./pages/NFTs.svelte"

export const routesWithDetails = {
    '/': {
        component: Dashboard,
        name: "Dashboard",
    },
    '/dashboard': {
        component: Dashboard,
        name: "Dashboard",
        hidden: true
    },
    '/inventory': {
        component: NFTs,
        name: "NFTs"
    }
}

export const routes = Object.entries(routesWithDetails).reduce((acc, [url, v]) => ({...acc, [url]: v.component}), {})
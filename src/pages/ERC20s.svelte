<script>
    import { User, tokens } from 'src/stores/wallet';
    import Flows from 'src/flows/Flows.svelte';
    import BalanceBanner from 'src/comps/BalanceBanner.svelte';
    import EventHistory from 'src/comps/history/EventHistory.svelte';
    import { generateFakeBalances } from 'src/util/generic';
    import { link } from 'svelte-spa-router';

    // let defaultBalances = []

    // $: user = $User
    // $: defaultBalances = generateFakeBalances(tokens)
</script>

<a href="/portfolio" use:link>port</a>

<!-- <BalanceBanner defaultBalances={user && user !== false ? [] : defaultBalances} /> -->
<EventHistory />
<!-- <Flows /> -->

<script>
    import { User, tokens } from 'src/stores/wallet';
    import Flows from 'src/flows/Flows.svelte';
    import BalanceBanner from 'src/comps/BalanceBanner.svelte';
    import EventHistory from 'src/comps/history/EventHistory.svelte';
    import { generateFakeBalances } from 'src/util/generic';

    // let defaultBalances = []

    // $: user = $User
    // $: defaultBalances = generateFakeBalances(tokens)
</script>

<!-- <BalanceBanner defaultBalances={user && user !== false ? [] : defaultBalances} /> -->
<EventHistory />
<!-- <Flows /> -->

<script>
    // import { User, tokens } from 'src/stores/wallet';
    import Flows from 'src/flows/Flows.svelte';
    import BalanceBanner from 'src/comps/BalanceBanner.svelte';
    import EventHistory from 'src/comps/history/EventHistory.svelte';
    import TestSelect from 'src/comps/TestSelect.svelte';
    import { generateFakeBalances } from 'src/util/generic';
    import Title from 'src/comps/Title.svelte';

    // let defaultBalances = []

    // $: user = $User
    // $: defaultBalances = generateFakeBalances(tokens)
</script>

<Title noMargin={true} title="NFT inventory" />

<TestSelect />

<!-- <BalanceBanner defaultBalances={user && user !== false ? [] : defaultBalances} /> -->
<!-- <EventHistory /> -->
<!-- <Flows /> -->

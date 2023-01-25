<script>
    import BasicModal from "src/comps/modal/BasicModal.svelte";
    import CoinInfo from "./CoinInfo.svelte";
    import { FlowStore } from "src/stores/flows";
</script>

<BasicModal overlayCloses={true} close={FlowStore.reset}>
    <CoinInfo />
</BasicModal>
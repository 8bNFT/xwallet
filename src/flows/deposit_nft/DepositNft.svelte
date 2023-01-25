<script>
    import StepperForm from "src/comps/modal/StepperModal.svelte";
    import Result from "src/flows/Result.svelte";
    import { createStepStore } from "src/stores/steps";
    import { createGenericStore, createGenericStores, withValidation } from "src/stores/generics"
    import { FlowStore } from "src/stores/flows";
    import { allValid, validate } from "src/validation/validate";
    import { isAssetOwner } from "src/validation/validators";
    import { Wallet } from "src/stores/wallet";
    // import DepositRequest from "./DepositRequest.svelte";
    import DepositReview from "./DepositReview.svelte";
    // import { handleDepositCall } from "./deposit";
    import merge from "lodash.merge"
    import { tick } from "svelte";

    const { User } = $Wallet

    const STEP_STORE = createStepStore(3, false)
    let loading = false

    // add validation of ownership!
    const payloadStore = createGenericStore($FlowStore.props)
    const resultStore = createGenericStore({})

    $: defaultConfig = {
        title: {
            text: "Deposit NFT",
        },
        footer: {
            primary: {
                text: "Next",
                action: ({ current, max }) => {
                    if(current === max){
                        return () => console.log("Finish")
                    }
                    return STEP_STORE.next
                },
                disabled: () => loading
            },
            secondary: {
                text: "Back",
                action: ({ current, max }) => STEP_STORE.prev,
                disabled: () => loading
            }
        },
        props: { formStore: payloadStore },
        close: () => FlowStore.reset()
    }

    $: steps = [
        {
            component: DepositReview,
            props: { asset: $payloadStore.asset },
            footer: {
                primary: {
                    text: () => `Deposit ${$payloadStore.asset.name}`,
                    action: () => async () => {
                        // loading = true
                        // resultStore.set(await handleDepositCall({ payload: $payloadStore }))
                        // loading = false
                        STEP_STORE.next()
                    },
                    disabled: () => !isAssetOwner($payloadStore.asset, $User?.address) && "You don't own this asset" || false,
                    loading: () => loading && "Deposit in progress" || false
                }
            }
        },
        {
            component: Result,
            title: false,
            props: {
                resultStore: $resultStore,
                title: () => $resultStore.error ? "Oops! Deposit failed." : "Deposit success!"
            }, 
            footer: {
                primary: {
                    text: () => $resultStore.error ? "Try again" : "Done",
                    action: ()=> () => {
                        if($resultStore.error) return STEP_STORE.reset()
                        FlowStore.reset()
                    }
                },
                secondary: $resultStore.error ? 
                    {
                        text: () =>  "Cancel",
                        action: () => () => FlowStore.reset()
                    } : 
                    false
            }
        }
    ]
</script>

<StepperForm 
    {steps}
    {defaultConfig}
    stepStore={STEP_STORE}
    overlayCloses={true}
/>
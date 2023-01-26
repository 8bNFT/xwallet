<script>
    import StepperForm from "src/comps/modal/StepperModal.svelte";
    import Result from "src/flows/Result.svelte";
    import { createStepStore } from "src/stores/steps";
    import { createGenericStore } from "src/stores/generics"
    import { FlowStore } from "src/stores/flows";
    import { isAssetOwner } from "src/validation/validators";
    import { Wallet } from "src/stores/wallet";
    import { handleFinalizeNftCall, handlePrepareNftCall } from "./withdraw";
    import WithdrawReview from "./WithdrawReview.svelte";

    const { User } = $Wallet

    const STEP_STORE = createStepStore(3, false)
    let loading = false

    const { token } = $FlowStore.props
    const resultStore = createGenericStore({})

    const step = token.status === "withdrawable" ? "finalize" : "prepare"
    const isPreparing = step === "prepare"
    const prettyStep = name => isPreparing ? `Prepare ${name || "NFT"} Withdrawal` : `Finalize ${name || "NFT"} Withdrawal`
    

    $: defaultConfig = {
        title: {
            text: prettyStep(),
        },
        props: {
            token,
            step
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
        close: () => FlowStore.reset()
    }

    $: steps = [
        {
            component: WithdrawReview,
            footer: {
                primary: {
                    text: () => prettyStep(token.name),
                    action: () => async () => {
                        loading = true
                        resultStore.set(isPreparing ? await handlePrepareNftCall({ token }) : await handleFinalizeNftCall({ token }))
                        loading = false
                        STEP_STORE.next()
                    },
                    disabled: () => !isAssetOwner(token, $User?.address) && "You don't own this asset" || false,
                    loading: () => loading && "Withdrawal in progress" || false
                }
            }
        },
        {
            component: Result,
            title: false,
            props: {
                resultStore: $resultStore,
                title: () => $resultStore.error ? "Oops! Withdraw failed." : "Withdraw success!"
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
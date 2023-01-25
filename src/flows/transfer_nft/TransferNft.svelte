<script>
    import StepperForm from "src/comps/modal/StepperModal.svelte";
    import Result from "src/flows/Result.svelte";
    import { createStepStore } from "src/stores/steps";
    import { createGenericStore, createGenericStores, withValidation } from "src/stores/generics"
    import { FlowStore } from 'src/stores/flows';
    import { allValid, validate } from "src/validation/validate";
    import { isNotEq, isEthAddress, isIMXUser } from "src/validation/validators";
    import { Wallet } from "src/stores/wallet";
    import TransferRequest from "./TransferRequest.svelte";
    import TransferReview from "./TransferReview.svelte";
    import { handleNftTransferCall } from "./transfer"
    import { parseAssets, flattenAssets } from "./util";

    let loading = false

    const { User } = $Wallet
    const STEP_STORE = createStepStore(3, false)
    const { assetStore, promise } = $FlowStore.props
    
    $: assets = parseAssets($assetStore)
    $: if(!assets.length) FlowStore.reset()

    
    const { resetAll: resetFlow, stores: [payloadStore, validationStore] } = createGenericStores(
        withValidation(
            {
                receiver: {
                    value: "",
                    validators: [
                        [isEthAddress, "Invalid ETH address"], 
                        [v => isNotEq(v.toLowerCase(), $User.address), "Receiver can't be same as sender"],
                        [async (v, controller) => isIMXUser(v, controller, Wallet.getNetwork()), "Receiver not registered on L2"]
                    ],
                    reactiveRevalidation: false
                }
            }
        )
    )
    const resultStore = createGenericStore({})
    const emptyValidationController = {}
    const validationController = {}

    $: allFilled = allValid({ payloadStore: $payloadStore, currentController: emptyValidationController, validationStore: $validationStore, emptyInvalid: true }) === true
    $: validate({ payloadStore: $payloadStore, validationStore: validationStore, currentController: validationController})

    $: defaultConfig = {
        title: {
            text: "Transfer NFTs",
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
        props: { formStore: payloadStore, validationStore },
        close: () => {
            promise.reject("FLOW_CLOSED")
            FlowStore.reset()
        }
    }

    $: steps = [
        {
            component: TransferRequest,
            props: { assets, assetStore },
            footer: {
                primary: {
                    text: () => `Review transfer`,
                    disabled: () => !allFilled || !$User || flattenAssets($assetStore).some(v => v.user !== $User?.address).length,
                }
            }
        },
        {
            component: TransferReview,
            props: { assets },
            footer: {
                primary: {
                    text: () => `Transfer NFTs`,
                    action: () => async () => {
                        loading = true
                        resultStore.set(await handleNftTransferCall({ receiver: $payloadStore.receiver, tokens: flattenAssets($assetStore) }))
                        loading = false
                        $resultStore.error ? promise.reject($resultStore) : promise.resolve($resultStore)
                        STEP_STORE.next()
                    },
                    disabled: () => !$User,
                    loading: () => loading && "Transfer in progress" || false
                }
            }
        },
        {
            component: Result,
            title: false,
            props: {
                resultStore: $resultStore,
                title: () => $resultStore.error ? "Oops! Transfer failed." : "Transfers success!"
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
<script>
    import StepperForm from "src/comps/modal/StepperModal.svelte";
    import Result from "src/flows/Result.svelte";
    import { createStepStore } from "src/stores/steps";
    import { createGenericStore, createGenericStores, withValidation } from "src/stores/generics"
    import { FlowStore } from 'src/stores/generics';
    import { allValid, validate } from "src/validation/validate";
    import { isNotEq, isEthAddress, isIMXUser } from "src/validation/validators";
    import { Wallet } from "src/stores/wallet";
    import merge from "lodash.merge"
    import TransferRequest from "./TransferRequest.svelte";
    import TransferReview from "./TransferReview.svelte";
    import { handleNftTransferCall } from "./transfer"

    const { User } = $Wallet

    const STEP_STORE = createStepStore(3, false)
    let loading = false

    const assetStore = $FlowStore.props.assetStore.value
    const parseAssets = assets => {
        return Object.entries(assets).reduce((acc, [address, assets]) => {
            if(!assets.length) return acc
            const collection = assets[0].collection
            return [...acc, [collection, assets]]
        }, [])
    }

    $: assets = parseAssets($assetStore)
    // add validation of ownership!
    const { resetAll: resetFlow, stores: [payloadStore, validationStore] } = createGenericStores(
        withValidation(
            merge(
                {
                    receiver: {
                        value: "",
                        validators: [
                            [isEthAddress, "Invalid ETH address"], 
                            [(v) => isNotEq(v.toLowerCase(), $User.address), "Receiver can't be same as sender"],
                            [async (v, controller) => isIMXUser(v, controller, Wallet.getNetwork()), "Receiver not registered on L2"]
                        ],
                        reactiveRevalidation: false
                    }
                },
                // ($FlowStore.props || {})
            )
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
        close: () => FlowStore.reset()
    }

    $: steps = [
        {
            component: TransferRequest,
            props: { assets, assetStore },
            footer: {
                primary: {
                    text: () => `Review transfer`,
                    action: () => async () => {
                        // loading = true
                        // resultStore.set(await handleDepositCall({ payload: $payloadStore }))
                        // loading = false
                        STEP_STORE.next()
                    },
                    disabled: () => !allFilled || !$User,
                    // loading: () => loading && "Transfer  in progress" || false
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
                        // loading = true
                        // resultStore.set(await handleDepositCall({ payload: $payloadStore }))
                        // loading = false
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
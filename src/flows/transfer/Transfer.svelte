<script>
    import StepperForm from "src/comps/modal/StepperModal.svelte";
    import { FlowStore } from 'src/stores/generics';
    import TransferRequest from "./TransferRequest.svelte";
    import TransferReview from "./TransferReview.svelte";
    import Result from "src/flows/Result.svelte";
    import { createStepStore } from "src/stores/steps";
    import { createGenericStore, createGenericStores, withValidation } from "src/stores/generics"
    import { allValid, validate } from "src/validation/validate";
    import { isEthAddress, isGtOrEq, isIMXUser, isLtOrEq, isNotEq, isNumber, isPositiveNumber, verifyPrecision } from "src/validation/validators";
    import { Wallet } from "src/stores/wallet";
    import { handleTransferCall } from "./transfer";
    import merge from "lodash.merge";

    const { Balances, User, Tokens } = $Wallet
    const STEP_STORE = createStepStore(3, false)
    let loading = false

    const { resetAll: resetFlow, stores: [payloadStore, validationStore] } = createGenericStores(
        withValidation(
            merge(
                {
                    coin: {
                        value: Object.keys($Balances)[0]
                    },
                    amount: {
                        value: "",
                        validators: [
                            [isNumber, "Value must be a number"],
                            [isPositiveNumber, "Value must be more than 0"], 
                            [(v) => isGtOrEq(v, $Balances[$payloadStore.coin].minimum), () => `Value must be greater than ${$Balances[$payloadStore.coin].minimum}`],
                            [(v) => verifyPrecision(v, $Balances[$payloadStore.coin].precision), () => `Decimal precision cannot exceed ${$Balances[$payloadStore.coin].precision} places`],
                            [(v) => isLtOrEq(v, $Balances[$payloadStore.coin].balance.parsed), () => `Not enough balance (${$Balances[$payloadStore.coin].balance.parsed} ${$Balances[$payloadStore.coin].symbol})`]
                        ]
                    },
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
                ($FlowStore.props || {})
            )
        )
    )

    $: $User, $Balances ? $payloadStore.coin = Object.keys($Balances)[0] : null

    const resultStore = createGenericStore({})

    const emptyValidationController = {}
    const validationController = {}
    $: allFilled = allValid({ payloadStore: $payloadStore, currentController: emptyValidationController, validationStore: $validationStore, emptyInvalid: true }) === true
    $: validate({ payloadStore: $payloadStore, validationStore: validationStore, currentController: validationController})

    $: defaultConfig = {
        title: {
            text: "Send " + $Tokens[$payloadStore.coin].symbol,
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
                disabled: () => !allFilled || loading
            },
            secondary: {
                text: "Back",
                action: ({ current, max }) => {
                    return STEP_STORE.prev
                },
                disabled: () => loading
            }
        },
        props: { formStore: payloadStore, validationStore },
        close: () => FlowStore.reset()
    }

    $: steps = [
        {
            component: TransferRequest, 
            props: {}, 
            footer: {
                primary: {
                    text: "Review transfer"
                },
            }
        },
        {
            component: TransferReview, 
            props: {}, 
            footer: {
                primary: {
                    text: "Transfer " + $Tokens[$payloadStore.coin].symbol,
                    action: () => { 
                        return async () => {
                            loading = true
                            resultStore.set(await handleTransferCall({ payload: $payloadStore }))
                            loading = false
                            STEP_STORE.next()
                        }
                    },
                    loading: () => loading ? "Transfer in progress" : false
                }
            }
        },
        {
            component: Result,
            title: false,
            props: {
                resultStore: $resultStore,
                title: () => $resultStore.error ? "Oops! Transfer failed." : "Transfer success!"
            }, 
            footer: {
                primary: {
                    text: () => $resultStore.error ? "Try again" : "Done",
                    action: ()=> () => {
                        if($resultStore.error) return STEP_STORE.reset()
                        FlowStore.reset()
                    }
                },
                secondary: Wallet.getNetwork() === "testnet" ? 
                $resultStore.error ? 
                {
                    text: () =>  "Cancel",
                    action: () => () => FlowStore.reset()
                } :
                false :
                {
                    text: () =>  $resultStore.error ? "Cancel" : "View on Immutascan",
                    action: () => () => {
                        if(!$resultStore.error){
                            window.open(`https://immutascan.io/tx/${$resultStore.result.transaction_id}`, "_blank")
                        }

                        FlowStore.reset()
                    }
                }
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
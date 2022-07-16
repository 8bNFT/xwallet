<script>
    import StepperForm from "src/comps/modal/StepperModal.svelte";
    import Result from "src/flows/Result.svelte";
    import { createStepStore } from "src/stores/steps";
    import { createGenericStore, createGenericStores, withValidation } from "src/stores/generics"
    import { FlowStore } from 'src/stores/generics';
    import { allValid, validate } from "src/validation/validate";
    import { isGtOrEq, isLtOrEq, isNumber, isPositiveNumber, verifyPrecision } from "src/validation/validators";
    import { Link, tokens } from "src/stores/wallet";
    import DepositRequest from "./DepositRequest.svelte";
    import DepositReview from "./DepositReview.svelte";
    import { handleDepositCall } from "./deposit";
    import merge from "lodash.merge"

    const STEP_STORE = createStepStore(3, false)
    let loading = false

    const { resetAll: resetFlow, stores: [payloadStore, validationStore] } = createGenericStores(
        withValidation(
            merge(
                {
                    coin: {
                        value: Object.keys(tokens)[0]
                    },
                    amount: {
                        value: "",
                        validators: [
                            [() => !isNaN($payloadStore[$payloadStore.coin]), "Fetching L1 balance..."],
                            [isNumber, "Value must be a number"],
                            [isPositiveNumber, "Value must be more than 0"], 
                            [(v) => isGtOrEq(v, tokens[$payloadStore.coin].minimum), () => `Value must be greater than ${tokens[$payloadStore.coin].minimum}`],
                            [(v) => verifyPrecision(v, tokens[$payloadStore.coin].precision), () => `Decimal precision cannot exceed ${tokens[$payloadStore.coin].precision} places`],
                            [(v) => isLtOrEq(v, $payloadStore[$payloadStore.coin]), () => `Not enough L1 balance (${$payloadStore[$payloadStore.coin]} ${tokens[$payloadStore.coin].symbol})`]
                        ]
                    }
                },
                ($FlowStore.props || {})
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
            text: "Deposit " + tokens[$payloadStore.coin].symbol,
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
                action: ({ current, max }) => STEP_STORE.prev,
                disabled: () => loading
            }
        },
        props: { formStore: payloadStore, validationStore },
        close: () => FlowStore.reset()
    }

    $: steps = [
        {
            component: DepositRequest,
            props: {},
            footer: {
                primary: {
                    text: `Review deposit`
                }
            }
        },
        {
            component: DepositReview,
            props: {},
            footer: {
                primary: {
                    text: () => `Deposit ${tokens[$payloadStore.coin].symbol}`,
                    action: () => async () => {
                        loading = true
                        resultStore.set(await handleDepositCall({ link: $Link, payload: $payloadStore, tokens }))
                        loading = false
                        STEP_STORE.next()
                    },
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
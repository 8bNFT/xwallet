<script>
    import StepperForm from "src/comps/modal/StepperModal.svelte";
    import Result from "src/flows/Result.svelte";
    import { createStepStore } from "src/stores/steps";
    import { createToggleStore } from "src/stores/toggle";
    import { createGenericStore, createGenericStores, withValidation } from "src/stores/generics"
    import { FlowStore } from 'src/stores/generics';
    import { allValid, validate } from "src/validation/validate";
    import { isGtOrEq, isLtOrEq, isNumber, isPositiveNumber, verifyPrecision } from "src/validation/validators";
    import { Link, Balances, tokens } from "src/stores/wallet";
    import WithdrawalRequest from "./WithdrawalRequest.svelte";
    import { handlePrepareCall, handleFinalizeCall } from "./withdraw";
    import merge from "lodash.merge"
    import { formatCryptoDisplay } from "src/util/cfx";

    const STEP_STORE = createStepStore(3, false)
    const currentStep = createToggleStore(["prepare", "finalize"])
    let loading = false
    let allFilled = false

    const { resetAll: resetFlow, stores: [payloadStore, validationStore] } = createGenericStores(
        withValidation(
            merge(
                {
                    coin: {
                        value: Object.keys($Balances)[0]
                    },
                    step: {
                        value: "prepare"
                    },
                    amount: {
                        value: "",
                        validators: [
                            [isNumber, "Value must be a number"],
                            [isPositiveNumber, "Value must be more than 0"], 
                            [(v) => isGtOrEq(v, tokens[$payloadStore.coin].minimum), () => `Value must be greater than ${tokens[$payloadStore.coin].minimum}`],
                            [(v) => verifyPrecision(v, tokens[$payloadStore.coin].precision), () => `Decimal precision cannot exceed ${tokens[$payloadStore.coin].precision} places`],
                            [(v) => isLtOrEq(v, $Balances[$payloadStore.coin].balance.parsed), () => `Not enough L2 balance (${$Balances[$payloadStore.coin].balance.parsed} ${tokens[$payloadStore.coin].symbol})`]
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
    
    $: if($currentStep === "prepare"){
        allFilled = allValid({ payloadStore: $payloadStore, currentController: emptyValidationController, validationStore: $validationStore, emptyInvalid: true }) === true
    } else {
        allFilled = Number($Balances[$payloadStore.coin].withdrawable.parsed) > 0
    }    
    $: validate({ payloadStore: $payloadStore, validationStore: validationStore, currentController: validationController})

    $: defaultConfig = {
        title: {
            text: "Withdraw " + tokens[$payloadStore.coin].symbol,
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
        props: { formStore: payloadStore, validationStore, currentStep },
        close: () => FlowStore.reset()
    }

    $: steps = [
        {
            component: WithdrawalRequest,
            props: {},
            footer: {
                primary: {
                    text: () => {
                        if($currentStep === "prepare"){
                            if($Balances[$payloadStore.coin].balance.parsed > 0) return "Prepare a withdrawal"
                            return "Nothing to prepare"
                        }

                        if($Balances[$payloadStore.coin].withdrawable.parsed > 0) return `Withdraw ${formatCryptoDisplay($Balances[$payloadStore.coin].withdrawable.parsed, tokens[$payloadStore.coin].precision)} ${tokens[$payloadStore.coin].symbol}`
                        return "Nothing to withdraw"
                    },
                    loading: () => {
                        if(!loading) return false
                        if($currentStep === "prepare") return "Preparing withdrawal"
                        return "Withdrawing tokens"
                    },
                    action: () => {
                        return async () => {
                            loading = true
                            if($currentStep === "prepare"){
                                resultStore.set(await handlePrepareCall({ link: $Link, payload: $payloadStore, tokens }))
                            } else {
                                resultStore.set(await handleFinalizeCall({ link: $Link, payload: $payloadStore, tokens }))
                            }
                            loading = false
                            STEP_STORE.next()
                        }
                    }
                }
            }
        },
        {
            component: Result,
            title: false,
            props: {
                resultStore: $resultStore,
                title: () => $resultStore.error ? "Oops! Withdrawal failed." : "Withdrawal success!"
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
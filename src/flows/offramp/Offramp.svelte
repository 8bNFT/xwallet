<script>
    import StepperForm from "src/comps/modal/StepperModal.svelte";
    import Result from "src/flows/Result.svelte";
    import { createStepStore } from "src/stores/steps";
    import { createGenericStore, createGenericStores, withValidation } from "src/stores/generics"
    import { FlowStore } from 'src/stores/generics';
    import { tokens, Wallet, Link, Balances } from "src/stores/wallet";
    import { filterOfframpTokens } from "src/util/imx";
    import OfframpRequest from "./OfframpRequest.svelte";
    import merge from "lodash.merge"
    import { handleOfframpCall } from "./offramp";
    import { isGtOrEq, isLtOrEq, isNumber, isPositiveNumber, verifyPrecision } from "src/validation/validators";
    import { allValid, validate } from "src/validation/validate";

    const STEP_STORE = createStepStore(3, false)
    let loading = false

    let offrampTokens = filterOfframpTokens($Balances, Wallet.getNetwork())
    $: offrampTokens = filterOfframpTokens($Balances, Wallet.getNetwork())

    const { resetAll: resetFlow, stores: [payloadStore, validationStore] } = createGenericStores(
        withValidation(
            merge(
                {
                    coin: {
                        value: Object.keys(offrampTokens)[0]
                    },
                    amount: {
                        value: "",
                        validators: [
                            [isNumber, "Value must be a number"],
                            [isPositiveNumber, "Value must be more than 0"], 
                            [(v) => isGtOrEq(v, $Balances[$payloadStore.coin].minimum), () => `Value must be greater than ${$Balances[$payloadStore.coin].minimum}`],
                            [(v) => isGtOrEq(v, 0.025), () => `Value must be greater than ${0.015}`],
                            [(v) => verifyPrecision(v, $Balances[$payloadStore.coin].precision), () => `Decimal precision cannot exceed ${$Balances[$payloadStore.coin].precision} places`],
                            [(v) => isLtOrEq(v, $Balances[$payloadStore.coin].balance.parsed), () => `Not enough balance (${$Balances[$payloadStore.coin].balance.parsed} ${$Balances[$payloadStore.coin].symbol})`]
                        ]
                    }
                },
                ($FlowStore.props || {})
            )
        )
    )

    const emptyValidationController = {}
    const validationController = {}
    $: allFilled = allValid({ payloadStore: $payloadStore, currentController: emptyValidationController, validationStore: $validationStore, emptyInvalid: true }) === true
    $: validate({ payloadStore: $payloadStore, validationStore: validationStore, currentController: validationController})

    const resultStore = createGenericStore({})

    $: defaultConfig = {
        title: {
            text: "Sell " + tokens[$payloadStore.coin].symbol,
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
        props: { formStore: payloadStore, validationStore, offrampTokens },
        close: () => FlowStore.reset()
    }

    $: steps = [
        {
            component: OfframpRequest,
            props: {},
            footer: {
                primary: {
                    text: () => `Sell ` + offrampTokens[$payloadStore.coin].symbol,
                    action: () => async () => {
                        loading = true
                        resultStore.set(await handleOfframpCall({ link: $Link, payload: $payloadStore, tokens }))
                        loading = false
                        STEP_STORE.next()
                    },
                    loading: () => loading ? "Offramp in progress" : false,
                    disabled: () => !allFilled
                },
            }
        },
        {
            component: Result,
            title: false,
            props: {
                resultStore: $resultStore,
                title: () => $resultStore.error ? "Oops! Offramp failed." : "Offramp success!"
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
<script>
    import StepperForm from "src/comps/modal/StepperModal.svelte";
    import Result from "src/flows/Result.svelte";
    import { createStepStore } from "src/stores/steps";
    import { createGenericStore } from "src/stores/generics"
    import { FlowStore } from 'src/stores/generics';
    import { tokens, Wallet, Link } from "src/stores/wallet";
    import { filterOnrampTokens } from "src/util/imx";
    import OnrampRequest from "./OnrampRequest.svelte";
    import merge from "lodash.merge"
    import { handleOnrampCall } from "./onramp";

    const STEP_STORE = createStepStore(3, false)
    let loading = false

    const onrampTokens = filterOnrampTokens(tokens, Wallet.getNetwork())

    const payloadStore = createGenericStore(
            merge(
                {
                    coin: Object.keys(onrampTokens)[0]
                },
                ($FlowStore.props || {})
            )
    )

    const resultStore = createGenericStore({})

    $: defaultConfig = {
        title: {
            text: "Buy " + tokens[$payloadStore.coin].symbol,
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
        props: { formStore: payloadStore, onrampTokens },
        close: () => FlowStore.reset()
    }

    $: steps = [
        {
            component: OnrampRequest,
            props: {},
            footer: {
                primary: {
                    text: () => `Buy ` + onrampTokens[$payloadStore.coin].symbol,
                    action: () => async () => {
                        loading = true
                        resultStore.set(await handleOnrampCall({ link: $Link, payload: $payloadStore, tokens }))
                        loading = false
                        STEP_STORE.next()
                    },
                    loading: () => loading ? "Purchase in progress" : false
                },
            }
        },
        {
            component: Result,
            title: false,
            props: {
                resultStore: $resultStore,
                title: () => $resultStore.error ? "Oops! Purchase failed." : "Purchase success!"
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
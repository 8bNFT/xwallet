<script>
    import StepperForm from "src/comps/modal/StepperModal.svelte";
    import TransferRequest from "./TransferRequest.svelte";
    import { createStepStore } from "src/stores/steps";
    import { createPayloadStore } from "src/stores/payload"
    import { allValid, validate } from "src/validation/validate";
    import { isEthAddress, isIMXUser, isLtOrEq, isNotEq, isPositiveNumber } from "src/validation/validators";
    import { Wallet } from "src/stores/wallet";
    import TransferReview from "./TransferReview.svelte";

    let User = $Wallet.User
    let Balances = $Wallet.Balances
    let tokens = $Wallet.tokens
    let Link = $Wallet.Link

    const STEP_STORE = createStepStore(3, false)

    const validationStore = createPayloadStore({
        coin: {}, amount: {}, receiver: {}
    })

    const payloadStore = createPayloadStore({
        coin: {
            value: Object.keys($Balances)[0]
        },
        amount: {
            value: 1,
            validators: [
                [isPositiveNumber, "Value must be more than 0"], 
                [(v) => isLtOrEq(v, $Balances[$payloadStore.coin.value].balance.parsed), () => `Not enough balance (${$Balances[$payloadStore.coin.value].balance.parsed} ${$Balances[$payloadStore.coin.value].symbol})`]
            ]
        },
        receiver: {
            value: "",
            validators: [
                [isEthAddress, "Invalid ETH address"], 
                [(v) => isNotEq(v.toLowerCase(), $User.address), "Receiver can't be same as sender"],
                [async (v, controller) => isIMXUser(v, controller, Wallet.getNetwork()), "Receiver not registered on L2"]
            ]
        }
    })

    const extractTransferPayload = () => {
        const token = tokens[$payloadStore.coin.value]

        if(token.id === "ETH"){
            return [
                {
                    type: "ETH",
                    amount: $payloadStore.amount.value,
                    toAddress: $payloadStore.receiver.value
                }
            ]
        }

        return [
            {
                type: "ERC20",
                tokenAddress: token.token_address,
                symbol: token.symbol,
                amount: $payloadStore.amount.value,
                toAddress: $payloadStore.receiver.value
            }
        ]
    }

    $: defaultConfig = {
        title: {
            text: "Transfer " + tokens[$payloadStore.coin.value].symbol,
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
                disabled: () => !allValid($payloadStore, true)
            },
            secondary: {
                text: "Back",
                action: ({ current, max }) => {
                    return STEP_STORE.prev
                }
            }
        },
        props: { formStore: payloadStore, validationStore },
        close: () => {
            STEP_STORE.reset()
            open = false
        }
    }

    $: steps = [
        {
            component: TransferRequest, 
            props: {title: "This is test #1"}, 
            title: {
                text: "Send some " + tokens[$payloadStore.coin.value].symbol
            },
            footer: {
                primary: {
                    text: "Review request"
                },
            }
        },
        {
            component: TransferReview, 
            props: {title: "This is test #2"}, 
            footer: {
                primary: {
                    text: "Transfer " + tokens[$payloadStore.coin.value].symbol,
                    action: () => { 
                        return async () => {
                            await $Link.transfer(extractTransferPayload())
                            STEP_STORE.next()
                        }
                    }
                }
            }
        },
        {
            component: TransferRequest, 
            props: {title: "This is test #3"}, 
            footer: {primary: {text: "This is an override", action: () => () => open = false}, secondary: true}
        }
    ]

    let open = false
    const controllerStore = {}

    $: validate($payloadStore, validationStore, controllerStore)
</script>

<button on:click={() => {STEP_STORE.reset(); open = true; console.log($payloadStore)}} style="z-index: 100; position: relative">Toggle transfer flow</button>

{#if open}
<StepperForm 
    {steps}
    {defaultConfig}
    stepStore={STEP_STORE}
    overlayCloses={true}
/>
{/if}
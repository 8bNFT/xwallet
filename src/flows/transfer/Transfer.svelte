<script>
    import StepperForm from "src/comps/modal/StepperModal.svelte";
    import TransferRequest from "./TransferRequest.svelte";
    import { createStepStore } from "src/stores/steps";

    const formStore = {
        value: ""
    }

    const defaultConfig = {
        title: {
            text: "Transfer",
        },
        footer: {
            primary: {
                text: "This is a primary button",
                action: ({ current, max }) => {
                    if(current === max){
                        return () => console.log("Finish")
                    }
                    return STEP_STORE.next
                }
            },
            secondary: {
                text: "This is a secondary button",
                action: ({ current, max }) => {
                    return STEP_STORE.prev
                }
            }
        },
        props: { formStore },
        close: () => open = false
    }

    const steps = [
        {
            component: TransferRequest, 
            props: {title: "This is test #1"}, 
            footer: {primary: true}
        },
        {
            component: TransferRequest, 
            props: {title: "This is test #2"}, 
            footer: {primary: true, secondary: true}
        },
        {
            component: TransferRequest, 
            props: {title: "This is test #3"}, 
            footer: {primary: {text: "This is an override", action: () => () => open = false}, secondary: true}
        }
    ]

    const STEP_STORE = createStepStore(steps.length, false)
    let open = true
</script>

<button on:click={() => {STEP_STORE.reset(); open = true; console.log(formStore)}} style="z-index: 100; position: relative">Toggle open</button>

{#if open}
<StepperForm 
    {steps}
    {defaultConfig}
    stepStore={STEP_STORE}
    overlayCloses={false}
/>
{/if}
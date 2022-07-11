<script>
    import StepperForm from "@/comps/stepper_form.svelte";
    import TestAction from "src/comps/test_action.svelte";
    import { createStepStore } from "@/stores/steps";

    const steps = [
        {
            component: TestAction, 
            props: {title: "This is test #1"}, 
            title: {
                text: "This is a text"
            },
            footer: {primary: true, secondary: true}
        },
        {
            component: TestAction, 
            props: {title: "This is test #2"}, 
            footer: {primary: true, secondary: true}
        },
        {
            component: TestAction, 
            props: {title: "This is test #3"}, 
            footer: {primary: {text: "This is an override", action: () => () => open = false}, secondary: true}
        }
    ]

    const STEP_STORE = createStepStore(steps.length, false)
    
    const default_config = {
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
        close: () => open = false
    }

    let open = false

    $: console.log(typeof test !== "undefined" ? test : "lol")

</script>

<button on:click={() => {STEP_STORE.reset(); open = true}} style="z-index: 100; position: relative">Toggle open</button>

{#if open}
<StepperForm 
    let:test
    {steps}
    defaultConfig={default_config}
    stepStore={STEP_STORE}
    overlayCloses={true}
/>
{/if}
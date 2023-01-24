export function outclick(node){
    const handler = e => {
        if(node.contains(e.target)) return
        node.dispatchEvent(new CustomEvent("outclick"))
    }

    document.addEventListener("click", handler)

    return {
        destroy(){
            document.removeEventListener("click", handler)
        }
    }
}
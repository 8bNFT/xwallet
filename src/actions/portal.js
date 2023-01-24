export function portal(node){
    let ref = node
    document.body.appendChild(ref)

    return {
        destroy(){
            if(document.body.contains(ref)) document.body.removeChild(ref)
        }
    }
}
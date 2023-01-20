import { derived, writable } from "svelte/store";

function createToastStore(){
	const notificationStore = writable([]);
    
    const send = (message, type = "success", timeout = 3) => notificationStore.update(v => [...v, { message, type, expiration: Date.now() + (timeout * 1000)}])
    
    let interval

    const clearCleanupInterval = () => {
        clearInterval(interval)
        interval = false
    }

    const notificationsCleanup = derived(notificationStore, ($notificationStore, set) => {
        set($notificationStore)
        if(!$notificationStore.length){
            if(interval) clearCleanupInterval()
        } else if(!interval) { 
            interval = setInterval(
                () => {
                    const filtered = $notificationStore.filter(({ expiration }) => expiration > Date.now())
                    if(filtered.length === $notificationStore.length) return
                    notificationStore.set(filtered)
                }, 
                500
            )
        }

        return () => clearCleanupInterval()
    })

	return {
		subscribe: notificationsCleanup.subscribe,
        send,
        success: (message, timeout) => send(message, "success", timeout),
        warning: (message, timeout) => send(message, "warning", timeout),
        error: (message, timeout) => send(message, "error", timeout),
		clearAll: () => notificationStore.set([])
	};
}

export const ToastStore = createToastStore()
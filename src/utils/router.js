import router from "@system.router"

const history = [{ uri: '/pages/index' }]
//全部用replace，节省内存
export default {
    push(uri, params) {
        history.push({uri, params})
        router.replace({ uri, params })
        console.log(history)
    },
    pushNoReplace(uri, params) {
        history.push({uri, params ,pushNoReplace: true})
        router.push({ uri, params })
        console.log(history)
    },
    back() {
        console.log(history)
        if (history.length > 0) {
            if(history[history.length - 1].pushNoReplace){
                history.pop()
                return router.back()
            }
            history.pop()
            return router.replace(history[history.length - 1])
        }
        return router.back()
    },
    replace(uri, params) {
        history[history.length - 1] = { uri, params }
        router.replace({ uri, params })
    }
}

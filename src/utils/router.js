import router from "@system.router"

const history = [{ uri: '/pages/index' }]
//全部用replace，节省内存
export default {
    push(uri, params) {
        history.push({uri, params})
        router.replace({ uri, params })
        console.log(history)
    },
    back() {
        console.log(history)
        if (history.length > 0) {
            history.pop()
            router.replace(history[history.length - 1])
        } else {
            router.back()
        }
    },
    replace(uri, param) {
        history[history.length - 1] = { uri, param }
        router.replace({ uri, param })
    }
}

import storage from '@system.storage'

export default class cookies {
    constructor() {
        this.cookies = new Map()
        this.getCookiesFromStorage()
            .then((cookies) => {
                this.cookies = cookies
                console.log(this.toString())
             })
    }
    setCookie(key, value) {
        if (!key) return
        this.cookies.set(key, value)
    }
    setCookies(cookies) {
        cookies.split(";").forEach((cookie) => {
            cookie = cookie.trim()
            console.log(cookie)
            const [key, value] = cookie.split("=")
            if (key == "Expires") return
            if (key == "Path") return
            this.setCookie(key, value)
        })
    }
    getCookie(key) {
        return this.cookies.get(key)
    }
    saveCookies() {
        storage.set({ key: "cookies", value: JSON.stringify([...this.cookies]) })
    }
    getCookiesFromStorage() {
        return new Promise((resolve, reject) => {
            storage.get({
                key: "cookies",
                success: (res) => {
                    if(!res) return resolve(new Map())
                    const cookies = new Map(JSON.parse(res))
                    resolve(cookies)
                },
                fail: (data) => {
                    reject(data)
                }
            })
        })
    }
    toString() {
        return [...this.cookies].map(([key, value]) => {
            return value? `${key}=${value}` : ""
        }).join("; ")
    }
}
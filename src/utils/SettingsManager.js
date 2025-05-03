import storage from '@system.storage'

export default class SettingsManager {
    constructor() {
        this.settings = new Map()
        this.ready = this.init()
        this.setTimeout = null
    }
    async init() {
        this.settings = await new Promise((resolve, reject) => {
            storage.get({
                key: "settings",
                success: (res) => {
                    if (!res) return resolve(new Map())
                    const settings = new Map(JSON.parse(res))
                    resolve(settings)
                },
                fail: (data) => {
                    reject(data)
                }
            })
        })
        return true
    }
    get(key) {
        return this.settings.get(key)
    }
    set(key, value) {
        this.settings.set(key, value)
        clearTimeout(this.setTimeout)
        this.setTimeout = setTimeout(() => this.save(), 100)
    }
    save() {
        storage.set({ key: "settings", value: JSON.stringify({...this.settings}) })
    }
}
import fetch from "@system.fetch"
import prompt from "@system.prompt"
import XiaomiError from "./XiaomiError"

export default function (url, options,debug=false) {
    console.log(url, options)
    return new Promise((resolve, reject) => {
        if(globalThis.settingsManager.get("noInternet"))return reject(new XiaomiError("请在设置里关掉模拟断网",1))
        fetch.fetch({
            url, ...options, header: options.headers,
            data: options.body,
            responseType:"text",
            success: (res) => {
                if(debug)console.log(res)
                resolve(new Response(res.data, {
                    headers: res.headers,
                    status:res.code
                }))
            },
            fail: (data, code) => {
                reject(new XiaomiError(data, code))
                prompt.showToast({ message: "网络错误"+code })
            },
        })
        /*  */
    })
}

export class Response {
    constructor(data, { headers, status }) {
        this.data = data
        this.headers = headers
        this.status = status
    }
    json() { return JSON.parse(this.data) }
}
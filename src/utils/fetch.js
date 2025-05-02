import fetch from "@system.fetch"
export default function (url, options,debug=false) {
    console.log(url, options)
    return new Promise((resolve, reject) => {
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
                reject({ data, code })
                console.log(`handling fail, code = ${code}`)
                console.log(data)
            },
        })
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
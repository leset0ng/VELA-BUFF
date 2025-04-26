import fetch from "@system.fetch"
export default function (url, options) {
    console.log(url, options)
    return new Promise((resolve, reject) => {
        fetch.fetch({
            url, ...options, header: options.headers,
            data: options.body,
            responseType:"text",
            success: (res) => {
                console.log(res.data)
                resolve({
                    body: {
                        json: () => JSON.parse(res.data),
                        valueOf: () => res.data
                    }
                    , status: res.code
                    , headers: res.headers
                    , ok: res.code === 200,
                })
            },
            fail: (data, code) => {
                reject({ data, code })
                console.log(`handling fail, code = ${code}`)
                console.log(data)
            },
        })
    })
}
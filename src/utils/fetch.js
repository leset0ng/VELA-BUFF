import fetch from "@system.fetch"
export default function (url, options) {
    console.log(url, options)
    return new Promise((resolve, reject) => {
        fetch.fetch({
            url, ...options, header: options.headers,
            data: options.body,
            responseType:"text",
            success: (res) => {
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
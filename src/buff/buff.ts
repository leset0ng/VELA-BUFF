import Cookies from "./cookiesManager"
import getDeviceID from "./deviceID"
export default class BUFF{
    private cookies: Cookies
    private fetch: (uri: string, options?: any) => Promise<Response>
    constructor(fetch:(uri:string,options?:any)=>Promise<Response>) {
        this.cookies = new Cookies()
        this.fetch = (uri, options) => fetch(uri, {
            ...options, headers: {
                origin: "https://buff.163.com", referer: "https://buff.163.com/","x-requested-with": "XMLHttpRequest",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51",
                ...options?.headers, cookie: this.cookies.toString(),
                "x-csrftoken": this.cookies.getCookie("csrf_token"),
                Accept: "*/*",
                AcceptEncoding: "gzip, deflate, br",
            }
        })
        this.cookies.setCookie("Locale-Supported","zh-Hans")
    }
    async login(qrcodeCallback = (uri,status) => {
        console.log("qrcode",uri)
    }) {
        const setCookies = (await this.fetch("https://buff.163.com/account/login")).headers["set-cookie"]
        this.cookies.setCookies(setCookies)
        if (!this.cookies.getCookie("csrf_token")) throw new Error("csrf_token not found")
        if (!(await (await this.fetch("https://buff.163.com/account/api/qr_code_login_open")).json())?.data["use_qr_code_login"]) throw new Error("qr_code_create failed")
        const {url, code_id} = (await (await this.fetch("https://buff.163.com/account/api/qr_code_create",
            {
                body: { "code_type": 1, "extra_param": "{}" },
                headers: { referer: "https://buff.163.com/account/login" ,"Content-Type": "application/json"},
                method: "POST"
            })).json()).data
        qrcodeCallback(url, 1)
        let status = 1
        do {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            const res = await this.fetch("https://buff.163.com/account/api/qr_code_poll?item_id=" + code_id)
            status = (await res.json()).data.state
            console.log(status)
            switch (status) {
                case 1:
                    break
                case 2:
                    qrcodeCallback(url, 2)
                    break
                case 3:
                    qrcodeCallback(url, 3)
                    this.cookies.setCookies(res.headers["set-cookie"])
                    break
                default:
                    qrcodeCallback(url, 5)
                    throw new Error("登录失败！")
            }
        } while (status <= 2)
        this.cookies.setCookies((await this.fetch("https://buff.163.com/account/api/qr_code_login",
            {
                body: {
                    "item_id": code_id, web_device_id: await getDeviceID()
                },
                headers: { "Content-Type": "application/json" },
                method: "POST"
            }
        )).headers["set-cookie"])
        this.cookies.saveCookies()
        return true
    }
    async logout() {
        // TODO: 退出登录
    }
    async getUserInfo() {
        return (await(await this.fetch("https://buff.163.com/account/api/user/info/v2")).json()).data.user_info
    }
    async getUserInventory() {

    }
}
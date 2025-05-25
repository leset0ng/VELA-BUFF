import { Item } from "./buffgoods"
import Cookies from "./cookiesManager"
import getDeviceID from "./deviceID"
import { User } from "./user"

const ITEM_PER_PAGE = 10
const BASE_URL = "https://buff.163.com"

export default class BUFF{
    cookies: Cookies
    get headers() {
        return {
            origin: BASE_URL, referer: BASE_URL, "x-requested-with": "XMLHttpRequest",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51",
            cookie: this.cookies.toString(),
            "x-csrftoken": this.cookies.getCookie("csrf_token"),
            Accept: "*/*",
            AcceptEncoding: "gzip, deflate, br",
        }
    }
    private user: User | null
    get loginStatus() { return this.user != null }
    ready:Promise<void>
    private fetch: (uri: string, options?: RequestInit) => Promise<Response>
    private bigFetch: (uri: string, options?: RequestInit) => Promise<Response>
    constructor(fetch: (uri: string, options?: RequestInit)=>Promise<Response>,bigFetch?: (uri: string, options?: RequestInit)=>Promise<Response>) {
        this.cookies = new Cookies()
        this.fetch = async (uri, options) => {
            const resp=await fetch(uri, {
                ...options, headers: {
                    ...this.headers, ...options?.headers
                }
            })
            this.cookies.setCookies(resp.headers["set-cookie"])
            return resp
        }
        if(!bigFetch)bigFetch=fetch
        this.bigFetch = (uri, options) => bigFetch(uri, {
            ...options,
            headers: { ...this.headers, ...options?.headers }
        })
        this.cookies.setCookie("Locale-Supported", "zh-Hans")
        this.ready = (async () => {
            await this.cookies.ready
            await this.getUserInfo()
        })()
    }
    async login(abortController?: AbortController, qrcodeCallback = (uri:string,status:number) => {
        console.log("qrcode",uri)
    }) {
        const checkCanceled = () => { if (abortController?.signal.aborted) throw new Error("用户已取消登录") }
        await this.fetch(BASE_URL+"/account/login")
        if (!this.cookies.getCookie("csrf_token")) throw new Error("csrf_token not found")
        if (!(await (await this.fetch(BASE_URL +"/account/api/qr_code_login_open")).json())?.data["use_qr_code_login"]) throw new Error("qr_code_create failed")
        checkCanceled()
        const { code, data } = (await (await this.fetch(BASE_URL +"/account/api/qr_code_create",
            {
                body: JSON.stringify({ "code_type": 1, "extra_param": "{}" }),
                headers: { referer: BASE_URL +"/account/login" ,"Content-Type": "application/json"},
                method: "POST"
            })).json())
        if(code !== "OK") throw new Error("获取二维码失败，你是否已经登录？")
        const {url,code_id} = data
        qrcodeCallback(url, 1)
        checkCanceled()
        let status = 1
        do {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            const res = await this.fetch(BASE_URL +"/account/api/qr_code_poll?item_id=" + code_id)
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
            checkCanceled()
        } while (status <= 2)
        (await this.fetch(BASE_URL +"/account/api/qr_code_login",
            {
                body:JSON.stringify({
                    "item_id": code_id, web_device_id: await getDeviceID()
                }) ,
                headers: { "Content-Type": "application/json" },
                method: "POST"
            }
        )).headers["set-cookie"]
        this.cookies.saveCookies()
        this.getUserInfo()
        return true
    }
    async logout() {
        this.cookies.clear()
        this.user = null
        await this.fetch(BASE_URL +"/account/logout")
    }
    async getUserInfo() {
        return this.user = (await (await this.fetch(BASE_URL +"/account/api/user/info/v2")).json()).data.user_info as User
    }
    async getUserInventory(page: number = 1, search: string = "") {
        if (!this.user) throw new Error("未登录！")
        const { code, data } = await (await this.fetch(`${BASE_URL}/api/market/steam_inventory?game=csgo&force=0&page_num=${page}&page_size=${ITEM_PER_PAGE}&fold=true&search=${search}&steamid=${this.user?.steamid}&state=all`)).json()
        if (code !== "OK") throw new Error(data)
        return data
    }
    async getPopular() {
        return (await (await this.fetch(BASE_URL +"/api/index/popular_sell_order")).json()).data
    }
    async getItemDesc(item: Item) {
        return (await (await this.fetch(`${BASE_URL}/api/market/item_desc_detail?appid=${item.appid}&classid=${item.asset_info?.classid}&instanceid=${item.asset_info?.instanceid}&assetid=${item.asset_info?.assetid}${item.id?'&sell_order_id='+item.id:""}`)).json()).data
    }
    async search(page: number = 1, name: string, param: string) {
        if (!name) name = ""
        if (!param) param = ""
        return (await (await this.fetch(
            encodeURI(`${BASE_URL}/api/market/goods?game=csgo&page_num=${page}&page_size=${ITEM_PER_PAGE}&tab=selling&search=${name}&${param}`),
        )).json()).data
    }
    inspect(item: Item) {
        //TODO: 功能坏的，抓包抓不明白
        throw new Error("别用")
        console.log(item.asset_info.assetid)
        return this.fetch("https://buff.163.com/api/market/csgo_asset/change_state_cs2", {
            body: JSON.stringify({ assetid: item.asset_info.assetid, contextid: 2 }),
            method:"POST"
        })
    }
}
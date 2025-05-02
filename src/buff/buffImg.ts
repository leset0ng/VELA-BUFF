export default class buffImg {
    uri: string
    fops: Map<string,number|string>
    constructor(uri:string) {
        const { baseUrl, fop } = buffImg.splitUrlAndFop(uri);
        this.uri = baseUrl
        this.fops = buffImg.fopPraser(fop)
        /* //小米不支持800*800以上的图片，所以这里等比例缩小到800
        if (this.fops.has("h") && this.fops.has("w")) {
            const w = this.fops.get("w") as number;
            const h = this.fops.get("h") as number;
            if (w > 800 || h > 800) {
                const scale = Math.min(800 / w, 800 / h);
                this.fops.set("w", Math.floor(w * scale));
                this.fops.set("h", Math.floor(h * scale));
                console.log("buffImg", "缩小图片", w, h, scale);
            }
        } */
        this.fops.set("f", "webp")

    }
    toString() {
        const str= this.uri + '?fop=' + Array.from(this.fops.entries()).map(([key, value]) => `${key}/${value}`).join('/')
        return str
    }
    static splitUrlAndFop(url: string) {
        const m = url.match(/^([^?]+)(\?[^#]*)?(#.*)?$/);
        if (!m) return { baseUrl: url, fop: '' };

        let [, path, query = '', hash = ''] = m;
        // 把 ? 去掉，按 & 拆分
        const params = query.slice(1).split('&').filter(Boolean);
        let fop = '', others: string[] = [];

        params.forEach(p => {
            if (p.startsWith('fop=')) fop = decodeURIComponent(p.slice(4));
            else others.push(p);
        });

        const baseUrl = path
            + (others.length ? '?' + others.join('&') : '')
            + hash;
        return { baseUrl, fop };
    }
    static fopPraser(fop:string) {
        if (!fop) return new Map<string,number|string>();
        const parts = fop.split('|');
        
        const result=new Map<string,number|string>()

        for (let i = 0; i < parts.length; i += 2) {
            const key = parts[i];
            const value = parts[i + 1];
            if (key && value !== undefined) {
                result.set(key, isNaN(Number(value)) ? value : Number(value))
            }
        }

        return result;
    }
}
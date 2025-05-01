export default class buffImg {
    uri: string
    fops: Map<string,number|string>
    constructor(uri:string) {
        const { baseUrl, fop } = buffImg.splitUrlAndFop(uri);
        this.uri = baseUrl
        this.fops = buffImg.fopPraser(fop)
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
        const parts = fop.split('/');
        
        const result=new Map<string,number|string>()

        for (let i = 0; i < parts.length; i += 2) {
            const key = parts[i];
            const value = parts[i + 1];
            if (key && value !== undefined) {
                result[key] = value;
            }
        }

        return result;
    }
}
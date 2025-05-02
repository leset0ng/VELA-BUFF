import { BuffData,GoodsInfo } from "../buff/buffgoods";
import { cacheText,getCacheText } from "./textCache";
export function parseData(data: BuffData) {
    const { items, goods_infos } = data;
    /* for (const key in goods_infos) {
        cacheText(JSON.stringify(goods_infos[key]), "goods_info_"+key)
    } */
    return items.map((item) => {
        return { item, goods_info: goods_infos[item.goods_id]}
    })
}

export async function getData(key: string) {
    return JSON.parse(await getCacheText("goods_info_"+key)) as GoodsInfo
}

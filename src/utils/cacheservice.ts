import { BuffData, GoodsInfo, Item } from '../buff/buffgoods';
import runAsyncFunc from './runAsyncFunc';
import storage from './tsStroge';

const ITEM_PREFIX = "buff_item_"
const GOODS_PREFIX = "buff_goods_"
const ITEM_INDEX_KEY = "buff_item_index"
const GOODS_INDEX_KEY = "buff_goods_index"
const ITEMS_PER_PAGE = 10

export class CacheService {
    static set(key: string, value: any) {
        return runAsyncFunc(storage.set, { key, value: JSON.stringify(value) });
    }

    static async get(key: string) {
        try {
            const res = await runAsyncFunc(storage.get, { key });
            return res && JSON.parse(res);
        } catch {
            return null;
        }
    }

    static remove(key: string) {
        return runAsyncFunc(storage.delete, { key });
    }

    static async cachePage(data: BuffData, pageNum: number) {
        const itemIndex = (await this.get(ITEM_INDEX_KEY)) || []
        const goodsIndex = (await this.get(GOODS_INDEX_KEY)) || []

        const items = data.items || []
        const goodsMap = data.goods_infos || {}

        for (const item of items) {
            const key = `${ITEM_PREFIX}${item.asset_info.assetid}`
            if (!itemIndex.includes(key)) {
                await this.set(key, item)
                itemIndex.push(key)
            }
        }

        for (const [id, goods] of Object.entries(goodsMap)) {
            const key = `${GOODS_PREFIX}${id}`
            if (!goodsIndex.includes(key)) {
                await this.set(key, goods)
                goodsIndex.push(key)
            }
        }

        await this.set(ITEM_INDEX_KEY, itemIndex)
        await this.set(GOODS_INDEX_KEY, goodsIndex)
    }
    static async getTotalPages() {
        const keys = (await this.get(ITEM_INDEX_KEY)) || []
        console.log('Total items:', keys.length)
        return Math.ceil(keys.length / ITEMS_PER_PAGE)
    }
    static async getPage(pageNum: number) {
        const keys = (await this.get(ITEM_INDEX_KEY)) || []
        const start = (pageNum - 1) * ITEMS_PER_PAGE
        const end = start + ITEMS_PER_PAGE
        const pageKeys = keys.slice(start, end)
        console.log(`Fetching items for page ${pageNum}:`, pageKeys)
        const result: { item: Item; goods_info: GoodsInfo }[] = []
        for (const key of pageKeys) {
            const item = await this.get(key)
            if (item) {
                const goods_info = await this.get(`${GOODS_PREFIX}${item.goods_id}`)
                result.push({item, goods_info})
            }
            else console.error(`Item not found for key: ${key}`)
        }
        return result
    }

    static async getAllItems() {
        const keys = (await this.get(ITEM_INDEX_KEY)) || []
        const result: Item[] = []
        for (const key of keys) {
            const item = await this.get(key)
            if (item) result.push(item)
        }
        return result
    }

    static async getAllGoods() {
        const keys = (await this.get(GOODS_INDEX_KEY)) || []
        const result: { [id: string]: GoodsInfo } = {}
        for (const key of keys) {
            const goods = await this.get(key)
            if (goods) {
                const id = key.replace(GOODS_PREFIX, "")
                result[id] = goods
            }
        }
        return result
    }

    static async clearAll() {
        const allKeys = [
            ...(await this.get(ITEM_INDEX_KEY)) || [],
            ...(await this.get(GOODS_INDEX_KEY)) || []
        ]
        for (const key of allKeys) await this.remove(key)
        await this.remove(ITEM_INDEX_KEY)
        await this.remove(GOODS_INDEX_KEY)
    }
}
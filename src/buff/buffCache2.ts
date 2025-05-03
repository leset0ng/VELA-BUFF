import { BuffData, GoodsInfo, Item } from './buffgoods';
import { CacheService } from '../utils/cacheservice';

/**
 * 基于基础 CacheService，按实体拆分缓存分页数据
 */
export class EntityCacheService {
    // 索引 key，用于记录所有已缓存实体的 ID 列表
    private static GOODS_INDEX_KEY = 'goods_index';
    private static ITEM_INDEX_KEY = 'item_index';

    /** 缓存单个 GoodsInfo 实体 */
    static async cacheGoods(goods: GoodsInfo) {
        const key = `goods:${goods.goods_id}`;
        await CacheService.set(key, goods);
        await this.addToIndex(this.GOODS_INDEX_KEY, goods.goods_id.toString());
    }

    /** 缓存单个 Item 实体 */
    static async cacheItem(item: Item) {
        const key = `item:${item.id}`;
        await CacheService.set(key, item);
        await this.addToIndex(this.ITEM_INDEX_KEY, item.id);
    }

    /** 缓存一页 BuffData，自动拆分并缓存所有实体 */
    static async cachePage(buff: BuffData) {
        // 缓存 goods_infos
        for (const [_, goods] of Object.entries(buff.goods_infos)) {
            await this.cacheGoods(goods);
        }
        // 缓存 items
        for (const item of buff.items) {
            await this.cacheItem(item);
        }
    }

    /** 从缓存中读取单个 GoodsInfo */
    static getGoods(id: number): Promise<GoodsInfo | null> {
        return CacheService.get(`goods:${id}`);
    }

    /** 从缓存中读取单个 Item */
    static getItem(id: string): Promise<Item | null> {
        return CacheService.get(`item:${id}`);
    }

    /** 获取所有已缓存的 GoodsInfo */
    static async getAllGoods(): Promise<GoodsInfo[]> {
        const ids = await CacheService.get(this.GOODS_INDEX_KEY) as string[] || [];
        const results: GoodsInfo[] = [];
        for (const id of ids) {
            const goods = await this.getGoods(Number(id));
            if (goods) results.push(goods);
        }
        return results;
    }

    /** 获取所有已缓存的 Item */
    static async getAllItems(): Promise<Item[]> {
        const ids = await CacheService.get(this.ITEM_INDEX_KEY) as string[] || [];
        const results: Item[] = [];
        for (const id of ids) {
            const item = await this.getItem(id);
            if (item) results.push(item);
        }
        return results;
    }

    /** 清除所有缓存 */
    static async clearAll() {
        const goodsIds = await CacheService.get(this.GOODS_INDEX_KEY) as string[] || [];
        for (const id of goodsIds) {
            await CacheService.remove(`goods:${id}`);
        }
        const itemIds = await CacheService.get(this.ITEM_INDEX_KEY) as string[] || [];
        for (const id of itemIds) {
            await CacheService.remove(`item:${id}`);
        }
        // 清空索引
        await CacheService.remove(this.GOODS_INDEX_KEY);
        await CacheService.remove(this.ITEM_INDEX_KEY);
    }

    /** 将实体 ID 添加到索引列表中（去重） */
    private static async addToIndex(indexKey: string, id: string) {
        let list = await CacheService.get(indexKey) as string[];
        if (!Array.isArray(list)) list = [];
        if (!list.includes(id)) {
            list.push(id);
            await CacheService.set(indexKey, list);
        }
    }
}

// 使用示例：
// const pageData: BuffData = await fetchPage(pageNum);
// await EntityCacheService.cachePage(pageData);

// 接口导出，可按需引入
export default EntityCacheService;

import { BuffData, GoodsInfo ,Item} from "./buffgoods"
import { CacheService } from "../utils/cacheservice";

// BuffDataCache：缓存 BuffData
export class BuffDataCache {
  private static GOODS_LIST_KEY = "buff:goods:list";
  private static ITEM_LIST_KEY  = "buff:item:list";

  // 保存整套数据
  static async save(data: BuffData) {
    // 1. 缓存 ID 列表
    const goodsIds = Object.keys(data.goods_infos);
    const itemIds  = data.items.map(i => i.asset_info?.assetid);
    CacheService.set(this.GOODS_LIST_KEY, goodsIds);
    CacheService.set(this.ITEM_LIST_KEY,  itemIds);

    // 2. 分别缓存每条
    for (const id of goodsIds) {
      await CacheService.set(`buff:goods:${id}`, data.goods_infos[id]);
    }
    for (const item of data.items) {
      await CacheService.set(`buff:item:${item.asset_info.assetid}`, item);
    }
  }

  // 读取整套数据
  static async load(): Promise<BuffData | null> {
    const goodsIds = await CacheService.get(this.GOODS_LIST_KEY);
    const itemIds  = await CacheService.get(this.ITEM_LIST_KEY);
    if (!goodsIds || !itemIds) return null;
    console.log(goodsIds,itemIds)
      const goods_infos: Record<string, GoodsInfo> = {};
    for (const id of goodsIds) {
      const g = await CacheService.get(`buff:goods:${id}`);
      if (g) goods_infos[id] = g;
    }

    const items: Item[] = [];
    for (const id of itemIds) {
      const it = await CacheService.get(`buff:item:${id}`) as Item;
      if (it) items.push(it);
    }

    return {
      fop_str: "",  // 如果 fop_str 也需缓存，可同样拆分
      goods_infos,
      items
    };
  }

  // 清空缓存
  static async clear() {
    const goodsIds = CacheService.get(this.GOODS_LIST_KEY) || [];
    const itemIds  = CacheService.get(this.ITEM_LIST_KEY)  || [];
    for (const id of await goodsIds)await CacheService.remove(`buff:goods:${id}`);
    for (const id of await itemIds)await CacheService.remove(`buff:item:${id}`);
    await CacheService.remove(this.GOODS_LIST_KEY);
    await CacheService.remove(this.ITEM_LIST_KEY);
  }
}

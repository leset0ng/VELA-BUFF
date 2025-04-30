import storage from '@system.storage'
import runAsyncFunc from "./runAsyncFunc"
// 调用 getText 获取文本并缓存,如果缓存存在则直接返回缓存的文本
export default async function cachedText(getText, key ,updateCallback=()=>{}) {
    const cache = await runAsyncFunc(storage.get, { key })
    updateCallback(cache)
    try {
        const text = await getText()
        if (text !== cache) {  // 如果文本发生变化,则更新缓存并返回新文本
            await runAsyncFunc(storage.set, { key, value: text })
            updateCallback(text)
            return text
        } else return cache  // 如果文本没有变化,则直接返回缓存的文本
    } catch (e) {
        console.error(e)
        return cache
    }
}
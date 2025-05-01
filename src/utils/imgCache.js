import file from '@system.file' 
import request from '@system.request' 
import crypto from '@system.crypto'
import runAsyncFunc from "./runAsyncFunc"

/**
 * 获取图片的缓存路径,如果没有缓存则下载并缓存
 * @param {String} url 图片的url
 * @returns {Promise<String>} 图片的缓存路径
 * @author lesetong
 */
export async function getImage(url) {
    const cachePath = getCachePath(url)
    try {
        const res = await runAsyncFunc(file.access, { uri: cachePath })
        console.log("getImage cached", url, cachePath,res)
        return cachePath
    } catch (e) {
        if (e.code !== 301) throw e
    }
    console.log("getImage cached", url, cachePath)
    const { token } = await runAsyncFunc(request.download, { url, filename: cachePath })
    console.log("getImage download", url, cachePath, token)
    return (await runAsyncFunc(request.onDownloadComplete, { token })).uri
}

function getCachePath(url) {
    const name = crypto.hashDigest({ data: url, algo: "MD5" })
    console.log("getCachePath", url, name)
    return `internal://cache/images/${name}.jpg`
}
export async function clearImageCache() {
    await runAsyncFunc(file.rmdir, { uri: "internal://cache/images/", recursive: true }) 
}
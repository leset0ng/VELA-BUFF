import request from '@system.request'
import file from '@system.file'
import runAsyncFunc from './runAsyncFunc'
import { Response } from './fetch'

export default async function fetch(url, options) {
    const { token } = await runAsyncFunc(request.download, { url, filename: "tempfile.txt", header: JSON.stringify(options?.headers) })
    const { uri } = await runAsyncFunc(request.onDownloadComplete, { token })
    const { text } = await runAsyncFunc(file.readText, { uri })
    return new Response(text, { status: 200 })
}
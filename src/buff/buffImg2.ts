export default function modifyImageSize(url: string, newWidth: number, newHeight: number ,f="png"): string {
    // 分割基础 URL 和查询参数
    const [base, query] = url.split('?');
    if (!query) return url+`?fop=imageView/2/w/${newWidth}/h/${newHeight}/f/${f}/q/75`;
    // 解析查询参数为键值对
    const params: Record<string, string> = {};
    query.split('&').forEach(pair => {
        const [key, ...value] = pair.split('=');
        params[key] = value.join('=');
    });
    // 提取并处理 fop 参数
    const fop = params.fop;
    if (!fop) return url;

    // 分割操作步骤并找到最后一个 imageView
    const operations = fop.replaceAll("%7C", "|").split('|');
    let lastImageViewIndex = -1;
    for (let i = operations.length - 1; i >= 0; i--) {
        if (operations[i].startsWith('imageView/')) {
            lastImageViewIndex = i;
            break;
        }
    }
    if (lastImageViewIndex === -1) return url;

    // 提取旧参数中的格式和质量
    const oldParts = operations[lastImageViewIndex].split('/');
    let format: string | undefined, quality: string | undefined;
    for (let i = 0; i < oldParts.length; i++) {
        /* if (oldParts[i] === 'f') format = oldParts[i + 1]; */
        if (oldParts[i] === 'q') quality = oldParts[i + 1];
    }

    // 构建新的缩放操作（强制使用 imageView/2 模式）
    const newOperationParts = [
        'imageView/2',
        `w/${newWidth}`,
        `h/${newHeight}`,
        `f/${f}`,
        ...(quality ? [`q/${quality}`] : [])
    ].join('/');

    // 替换操作并重建 URL
    operations[lastImageViewIndex] = newOperationParts;
    params.fop = operations.join('|');

    // 重新编码查询参数
    const newQuery = Object.entries(params)
        .map(([k, v]) => `${k}=${v}`)
        .join('&');
    const result = `${base}?${newQuery}`;
    return result;
}
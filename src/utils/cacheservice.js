import storage from '@system.storage'
import runAsyncFunc from './runAsyncFunc';
export class CacheService {
    static set(key, value) {
        return runAsyncFunc(storage.set, { key, value: JSON.stringify(value) });
    }
    static async get(key) {
        try {
            const res = await runAsyncFunc(storage.get, { key });
            return res && JSON.parse(res);
        } catch {
            return null;
        }
    }
    static remove(key) {
        return runAsyncFunc(storage.delete({key}))
    }
}
import storage from "@system.storage"

export default function getDeviceID() { 
    return new Promise((resolve, reject) => {
        storage.get({
            key: "deviceID", success: (res) => {
                if (res) { resolve(res) }
                else {
                    //生成32位随机字符串
                    const deviceID = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)
                    storage.set({ key: "deviceID", value: deviceID })
                    resolve(deviceID)
                }
            }, fail: (data) => { reject(data) }
        })
    })
}
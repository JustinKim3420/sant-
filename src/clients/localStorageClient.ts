class LocalStorage {
    static get(key: string): any {
        const storedItem = localStorage.getItem(key)
        if (!storedItem) {
            return null
        }
        return JSON.parse(storedItem)
    }
    // TODO: create an update feature that allows specific field updates
    static create(key: string, content: any) {
        const serializedData = JSON.stringify(content)
        localStorage.setItem(key, serializedData)
    }
    static createIfNotExist(key: string, content: any) {
        const existingData = this.get(key)
        if (!existingData) {
            this.create(key, content)
        }
        return this.get(key)

    }
    static delete(key: string) {
        localStorage.removeItem(key)
    }
}

export default LocalStorage
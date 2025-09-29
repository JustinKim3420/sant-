import LocalStorage from "./localStorageClient"

export type ProductType = {
    id: string
    name: string
    sellingPrice: number
}

const STATIC_PRODUCTS_DATA = [
    {
        id: 1,
        name: "Johnnie Runner",
        sellingPrice: 10.99
    },
    {
        id: 2,
        name: "Smirnon",
        sellingPrice: 17.49
    },
    {
        id: 3,
        name: "Low Evening",
        sellingPrice: 3.58
    },
    {
        id: 4,
        name: "Iceball",
        sellingPrice: 5.99
    },
    {
        id: 5,
        name: "Jack Beam",
        sellingPrice: 29.49
    }
]

export class Product {
    static readonly LOCAL_STORAGE_KEY = 'products'
    private static isInitialized = false

    private static _initializeProductList() {
        LocalStorage.createIfNotExist(Product.LOCAL_STORAGE_KEY, STATIC_PRODUCTS_DATA)
        Product.isInitialized = true
    }

    static getAll() {
        if (!this.isInitialized) {
            Product._initializeProductList()
        }
        return LocalStorage.get(this.LOCAL_STORAGE_KEY) as ProductType[]
    }
}
import { Discount } from "./discount";
import LocalStorage from "./localStorageClient";
import { Product, ProductType } from "./product";

export type CartItemType = (ProductType & { quantity: number })

export class Cart {
    static readonly LOCAL_STORAGE_KEY = 'products'
    private static isInitialized = false
    private initializeCart() {
        LocalStorage.create(Cart.LOCAL_STORAGE_KEY, {})
        Cart.isInitialized = true
    }

    addProduct(product: ProductType) {
        if (!Cart.isInitialized) { this.initializeCart() }
        const existingCart = LocalStorage.get(Cart.LOCAL_STORAGE_KEY) as CartItemType[]
        let addedProductToCart = false
        const newProductsList = existingCart.reduce((acc, current) => {
            let currentProduct = current
            if (current.id === product.id) {
                currentProduct = {
                    ...current,
                    quantity: current.quantity + 1
                }
                addedProductToCart = true
            }
            return [...acc, currentProduct]
        }, [] as CartItemType[])
        if (!addedProductToCart) {
            newProductsList.push({
                ...product,
                quantity: 1
            })
        }
        LocalStorage.create(Cart.LOCAL_STORAGE_KEY, newProductsList)

    }
    removeProduct() {

    }
}
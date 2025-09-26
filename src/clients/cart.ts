
import LocalStorage from "./localStorageClient";
import { ProductType } from "./product";

export type CartItemType = (ProductType & { quantity: number })

export class Cart {
    static readonly LOCAL_STORAGE_KEY = 'cart'
    private static cart: Cart
    private initializeCart() {
        LocalStorage.createIfNotExist(Cart.LOCAL_STORAGE_KEY, [])
    }

    private constructor() {
        this.initializeCart()
    }

    public static getInstance(): Cart {
        if (Cart.cart == null) {
            Cart.cart = new Cart()
        }
        return Cart.cart
    }

    static get(): CartItemType[] {
        return LocalStorage.get(Cart.LOCAL_STORAGE_KEY) as CartItemType[]
    }

    static getTotal(): number {
        const existingCart = LocalStorage.get(Cart.LOCAL_STORAGE_KEY) as CartItemType[]
        return Math.floor(existingCart.reduce((acc, cur) => { return acc + (cur.quantity * cur.sellingPrice) }, 0) * 100) / 100
    }

    addProduct(product: ProductType) {
        const existingCart = LocalStorage.get(Cart.LOCAL_STORAGE_KEY) as CartItemType[]
        let didAddProductToCart = false
        const newProductsList = existingCart.reduce((acc, current) => {
            let currentProduct = current
            if (current.id === product.id) {
                currentProduct = {
                    ...current,
                    quantity: current.quantity + 1
                }
                didAddProductToCart = true
            }
            return [...acc, currentProduct]
        }, [] as CartItemType[])
        if (!didAddProductToCart) {
            newProductsList.push({
                ...product,
                quantity: 1
            })
        }
        LocalStorage.create(Cart.LOCAL_STORAGE_KEY, newProductsList)
        console.log('---after addproduct', LocalStorage.get(Cart.LOCAL_STORAGE_KEY))

    }
    removeProduct(productId: string): ProductType | null {
        const existingCart = LocalStorage.get(Cart.LOCAL_STORAGE_KEY) as CartItemType[]
        let removedProduct: ProductType | null = null
        const newProductsList = existingCart.reduce((acc, current) => {
            let newProductinfo = current
            if (current.id === productId) {
                const newQuanitity = current.quantity - 1
                removedProduct = {
                    ...current
                }
                if (newQuanitity <= 0) { return [...acc] }
                newProductinfo = {
                    ...current,
                    quantity: current.quantity - 1
                }
            }
            return [...acc, newProductinfo]
        }, [] as CartItemType[])

        LocalStorage.create(Cart.LOCAL_STORAGE_KEY, newProductsList)
        console.log('---after removeProduct', LocalStorage.get(Cart.LOCAL_STORAGE_KEY))
        return removedProduct
    }
}

import LocalStorage from "./localStorageClient";
import { ProductType } from "./product";
import { Decimal } from 'decimal.js';
import { Discount } from "./discount";

export type CartItemType = (ProductType & { quantity: number })

export class Cart {
    static readonly LOCAL_STORAGE_KEY = 'cart'
    private static readonly SALES_TAX = 8.75
    private initializeCart() {
        LocalStorage.createIfNotExist(Cart.LOCAL_STORAGE_KEY, [])
    }
    constructor() {
        this.initializeCart()
    }
    public static getSalesTax() {
        return Cart.SALES_TAX
    }

    getAllItems(): CartItemType[] {
        return LocalStorage.get(Cart.LOCAL_STORAGE_KEY) as CartItemType[]
    }

    getTotal(): number {
        const existingCart = this.getAllItems()
        return existingCart.reduce((acc, cur) => {
            const sellingPriceDecimal = new Decimal(cur.sellingPrice)
            return acc.add(sellingPriceDecimal.mul(cur.quantity))
        }, new Decimal(0)).toDecimalPlaces(2).toNumber()
    }

    getProductTotal(productId: string): number {
        const discount = new Discount()
        const existingCart = this.getAllItems()
        const product = existingCart.find(item => item.id === productId)
        if (!product) { return 0 }
        const total = new Decimal(product.quantity).mul(product.sellingPrice).toDecimalPlaces(2).toNumber()
        return discount.applyDiscountsToProduct(productId, total)
    }
    private static _applySalesTax(total: number): number {
        const totalDecimal = new Decimal(total)
        const percentage = new Decimal(100).add(Cart.SALES_TAX)
        return totalDecimal.mul(percentage).div(100).toDecimalPlaces(2).toNumber()
    }
    getCartTotal(): number {
        const existingCart = this.getAllItems()
        const discountedTotal = existingCart.reduce((acc, cur) => {
            const productTotal = this.getProductTotal(cur.id)
            return acc + productTotal
        }, 0)
        return Cart._applySalesTax(discountedTotal)
    }

    addProduct(product: ProductType): ProductType {
        const existingCart = this.getAllItems()
        let didAddProductToCart = false
        let addedProduct: ProductType | null = null
        const newProductsList = existingCart.reduce((acc, current) => {
            let currentProduct = current
            if (current.id === product.id) {
                currentProduct = {
                    ...current,
                    quantity: current.quantity + 1
                }
                didAddProductToCart = true
                addedProduct = currentProduct
            }
            return [...acc, currentProduct]
        }, [] as CartItemType[])
        if (!didAddProductToCart) {
            const newProductInfo = {
                ...product,
                quantity: 1
            }
            newProductsList.push(newProductInfo)
            addedProduct = newProductInfo
        }
        if (!addedProduct) { throw new Error('Logical error occurred') }
        LocalStorage.create(Cart.LOCAL_STORAGE_KEY, newProductsList)
        return addedProduct
    }
    removeProduct(productId: string): ProductType | null {
        const existingCart = this.getAllItems()
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
        return removedProduct
    }
}
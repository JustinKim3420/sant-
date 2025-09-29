
import Decimal from "decimal.js";
import LocalStorage from "./localStorageClient";

export type DiscountType = {
    id: string
    name: string,
    percentAmount: number
    appliedProductIds: string[]
}

export class Discount {
    static readonly LOCAL_STORAGE_KEY = 'discount'

    constructor() {
        this.initializeDiscounts()
    }
    initializeDiscounts() {
        LocalStorage.createIfNotExist(Discount.LOCAL_STORAGE_KEY, [])
    }

    get(): DiscountType[] {
        return LocalStorage.get(Discount.LOCAL_STORAGE_KEY) as DiscountType[]
    }

    getDiscountsForProduct(productId: string): DiscountType[] {
        const discounts = this.get()
        const applicableDiscounts = discounts.filter(discount => discount.appliedProductIds.includes(productId))
        return applicableDiscounts
    }

    applyDiscountsToProduct(productId: string, productTotal: number) {
        const applicableDiscounts = this.getDiscountsForProduct(productId)
        let discountedTotal = new Decimal(productTotal)
        let cumulativeDiscountPercentage = applicableDiscounts.reduce((acc, cur) => {
            return acc + cur.percentAmount
        }, 0)
        if (cumulativeDiscountPercentage > 100) {
            cumulativeDiscountPercentage = 100
        } else if (cumulativeDiscountPercentage < 0) {
            cumulativeDiscountPercentage = 0
        }
        const discountPercent = new Decimal(100).minus(cumulativeDiscountPercentage).div(100)
        return discountedTotal.mul(discountPercent).toDecimalPlaces(2).toNumber()
    }

    addProductToDiscount(discountId: string, productId: string): DiscountType | null {
        const discounts = this.get()
        let updatedDiscount: DiscountType | null = null
        const newDiscountsList = discounts.reduce((acc, current) => {
            if (current.id === discountId) {
                const newDiscount: DiscountType = {
                    ...current,
                    appliedProductIds: [...current.appliedProductIds, productId]
                }
                updatedDiscount = newDiscount
                return [...acc, newDiscount]
            }
            return [...acc, current]
        }, [] as DiscountType[])

        LocalStorage.create(Discount.LOCAL_STORAGE_KEY, newDiscountsList)
        return updatedDiscount
    }
    // Need to add logic to dictate wether or not the discount should be allowed/ duplicated
    // private _validateDiscount() { }
    addItemGroupDiscount(discountName: string, discountPercentAmount: number, productIds: string[]) {
        const discounts = this.get()
        const newDiscount: DiscountType = {
            id: Date.now().toString(), // should move logic to localstorage and needs better logic
            name: discountName,
            percentAmount: discountPercentAmount,
            appliedProductIds: productIds
        }
        LocalStorage.create(Discount.LOCAL_STORAGE_KEY, [...discounts, newDiscount])
        return newDiscount
    }

    addItemDiscount(discountName: string, discountPercentAmount: number, productId: string): DiscountType {
        const discounts = this.get()
        const newDiscount: DiscountType = {
            id: Date.now().toString(), // should move logic to localstorage and needs better logic
            name: discountName,
            percentAmount: discountPercentAmount,
            appliedProductIds: [productId]
        }
        LocalStorage.create(Discount.LOCAL_STORAGE_KEY, [...discounts, newDiscount])
        return newDiscount

    }
    removeDiscount(discountId: string): DiscountType | null {
        const discounts = this.get()
        let removedDiscount: DiscountType | null = null
        const newDiscountsList = discounts.reduce((acc, current) => {
            if (current.id === discountId) {
                removedDiscount = current
                return acc
            }
            return [...acc, current]
        }, [] as DiscountType[])

        LocalStorage.create(Discount.LOCAL_STORAGE_KEY, newDiscountsList)
        return removedDiscount
    }
    removeItemDiscount(discountId: string, productId: string): DiscountType | null {
        const discounts = this.get()
        let updatedDiscount: DiscountType | null = null
        const newDiscountsList = discounts.reduce((acc, current) => {
            if (current.id === discountId) {
                const newDiscount: DiscountType = {
                    ...current,
                    appliedProductIds: current.appliedProductIds.filter(id => id !== productId)
                }
                updatedDiscount = newDiscount
                return [...acc, newDiscount]
            }
            return [...acc, current]
        }, [] as DiscountType[])

        LocalStorage.create(Discount.LOCAL_STORAGE_KEY, newDiscountsList)
        return updatedDiscount
    }
}

import LocalStorage from "./localStorageClient";

export type DiscountType = {
    id: string
    name: string,
    percentAmount: number
    appliedProductIds: string[]
}

export class Discount {
    static readonly LOCAL_STORAGE_KEY = 'discount'
    static discount: Discount
    private initializeDiscount() {
        LocalStorage.createIfNotExist(Discount.LOCAL_STORAGE_KEY, [])
    }

    private constructor() {
        this.initializeDiscount()
    }

    public static getInstance(): Discount {
        if (Discount.discount == null) {
            Discount.discount = new Discount()
        }
        return Discount.discount
    }

    static get(): DiscountType[] {
        return LocalStorage.get(Discount.LOCAL_STORAGE_KEY) as DiscountType[]
    }
    // Need to add logic to dictate wether or not the discount should be allowed/ duplicated
    // private _validateDiscount() { }
    addItemGroupDiscount(discountName: string, discountPercentAmount: number, productIds: string[]) {
        const existingCart = LocalStorage.get(Discount.LOCAL_STORAGE_KEY) as DiscountType[]
        const newDiscount: DiscountType = {
            id: Date.now().toString(), // should move logic to localstorage and needs better logic
            name: discountName,
            percentAmount: discountPercentAmount,
            appliedProductIds: productIds
        }
        LocalStorage.create(Discount.LOCAL_STORAGE_KEY, [...existingCart, newDiscount])
        return newDiscount
    }

    addItemDiscount(discountName: string, discountPercentAmount: number, productId: string): DiscountType {
        const existingCart = LocalStorage.get(Discount.LOCAL_STORAGE_KEY) as DiscountType[]
        const newDiscount: DiscountType = {
            id: Date.now().toString(), // should move logic to localstorage and needs better logic
            name: discountName,
            percentAmount: discountPercentAmount,
            appliedProductIds: [productId]
        }
        LocalStorage.create(Discount.LOCAL_STORAGE_KEY, [...existingCart, newDiscount])
        return newDiscount

    }
    // Need to introduce logic to remove discounts specific to the selected products
    removeDiscount(discountId: string): DiscountType | null {
        const existingCart = LocalStorage.get(Discount.LOCAL_STORAGE_KEY) as DiscountType[]
        let removedDiscount: DiscountType | null = null
        const newProductsList = existingCart.reduce((acc, current) => {
            if (current.id === discountId) {
                removedDiscount = current
                return acc
            }
            return [...acc, current]
        }, [] as DiscountType[])

        LocalStorage.create(Discount.LOCAL_STORAGE_KEY, newProductsList)
        return removedDiscount
    }
}
import { Discount, DiscountType } from "../clients/discount"
import { Command } from "./executer"

export class AddItemDiscountCommand implements Command {
    private discountName: string
    private discountPercentAmount: number
    private productIds: string[]
    private addedDiscount: DiscountType | null = null

    constructor(discountName: string, discountPercentAmount: number, productIds: string[]) {
        this.discountName = discountName
        this.discountPercentAmount = discountPercentAmount
        this.productIds = productIds
    }

    execute() {
        const addedDiscount = Discount.addItemGroupDiscount(this.discountName, this.discountPercentAmount, this.productIds)
        this.addedDiscount = addedDiscount
    }

    undo() {
        if (!this.addedDiscount) { return }
        Discount.removeDiscount(this.addedDiscount.id)
    }
    clone() {
        return new AddItemDiscountCommand(this.discountName, this.discountPercentAmount, this.productIds)
    }
}

export class RemoveDiscountFromItemCommand implements Command {
    private discountId: string
    private productId: string
    private removedDiscount: DiscountType | null = null

    constructor(discountId: string, productId: string) {
        this.discountId = discountId
        this.productId = productId
    }

    execute() {
        this.removedDiscount = Discount.removeItemDiscount(this.discountId, this.productId)
    }

    undo() {
        if (!this.removedDiscount) { return }
        Discount.addProductToDiscount(this.discountId, this.productId)
    }
    clone() {
        return new RemoveDiscountFromItemCommand(this.discountId, this.productId)
    }
}

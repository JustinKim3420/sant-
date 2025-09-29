import { Discount, DiscountType } from "../clients/discount"
import { Command } from "./executer"

export class AddItemDiscountCommand implements Command {
    private discountName: string
    private discountPercentAmount: number
    private productIds: string[]
    private addedDiscount: DiscountType | null = null
    private discount: Discount

    constructor(discountName: string, discountPercentAmount: number, productIds: string[]) {
        this.discountName = discountName
        this.discountPercentAmount = discountPercentAmount
        this.productIds = productIds
        this.discount = new Discount()
    }

    execute() {
        const addedDiscount = this.discount.addItemGroupDiscount(this.discountName, this.discountPercentAmount, this.productIds)
        this.addedDiscount = addedDiscount
    }

    undo() {
        if (!this.addedDiscount) { return }
        this.discount.removeDiscount(this.addedDiscount.id)
    }
    clone() {
        return new AddItemDiscountCommand(this.discountName, this.discountPercentAmount, this.productIds)
    }
}

export class RemoveDiscountFromItemCommand implements Command {
    private discountId: string
    private productId: string
    private removedDiscount: DiscountType | null = null
    private discount: Discount

    constructor(discountId: string, productId: string) {
        this.discountId = discountId
        this.productId = productId
        this.discount = new Discount()
    }

    execute() {
        this.removedDiscount = this.discount.removeItemDiscount(this.discountId, this.productId)
    }

    undo() {
        if (!this.removedDiscount) { return }
        this.discount.addProductToDiscount(this.discountId, this.productId)
    }
    clone() {
        return new RemoveDiscountFromItemCommand(this.discountId, this.productId)
    }
}

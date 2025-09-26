import { Cart } from "../clients/cart"
import { Discount, DiscountType } from "../clients/discount"
import { ProductType } from "../clients/product"
import { Command } from "./executer"

export class AddItemDiscountCommand implements Command {
    private discountClient: Discount
    private discountName: string
    private discountPercentAmount: number
    private productIds: string[]
    private addedDiscount: DiscountType | null = null

    constructor(discountName: string, discountPercentAmount: number, productIds: string[]) {
        this.discountClient = Discount.getInstance()
        this.discountName = discountName
        this.discountPercentAmount = discountPercentAmount
        this.productIds = productIds
    }

    execute() {
        const addedDiscount = this.discountClient.addItemGroupDiscount(this.discountName, this.discountPercentAmount, this.productIds)
        this.addedDiscount = addedDiscount
    }

    undo() {
        if (!this.addedDiscount) { return }
        this.discountClient.removeDiscount(this.addedDiscount.id)
    }
    clone() {
        return new AddItemDiscountCommand(this.discountName, this.discountPercentAmount, this.productIds)
    }
}

export class RemoveDiscountCommand implements Command {
    private discountId: string
    private discountClient: Discount
    private removedDiscount: DiscountType | null = null

    constructor(discountId: string) {
        this.discountId = discountId
        this.discountClient = Discount.getInstance()
    }

    execute() {
        this.removedDiscount = this.discountClient.removeDiscount(this.discountId)
    }

    undo() {
        if (!this.removedDiscount) { return }
        this.discountClient.addItemGroupDiscount(this.removedDiscount.name, this.removedDiscount.percentAmount, this.removedDiscount.appliedProductIds)
    }
    clone() {
        return new RemoveDiscountCommand(this.discountId)
    }
}

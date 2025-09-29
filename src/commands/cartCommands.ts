import { Cart } from "../clients/cart"
import { ProductType } from "../clients/product"
import { Command } from "./executer"

export class AddProductToCartCommand implements Command {
    private product: ProductType
    constructor(product: ProductType) {
        this.product = product
    }

    execute() {
        Cart.addProduct(this.product)
    }

    undo() {
        Cart.removeProduct(this.product.id)
    }
    clone() {
        return new AddProductToCartCommand(this.product)
    }
}

export class RemoveProductFromCartCommand implements Command {
    private productId: string
    private removedProduct: ProductType | null
    constructor(productId: string) {
        this.productId = productId
        this.removedProduct = null
    }

    execute() {
        this.removedProduct = Cart.removeProduct(this.productId)
    }

    undo() {
        if (!this.removedProduct) { return }
        Cart.addProduct(this.removedProduct)
    }
    clone() {
        return new RemoveProductFromCartCommand(this.productId)
    }
}

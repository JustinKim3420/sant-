import { Cart } from "../clients/cart"
import { ProductType } from "../clients/product"
import { Command } from "./executer"

export class AddProductToCartCommand implements Command {
    private product: ProductType
    private cart: Cart
    constructor(product: ProductType) {
        this.product = product
        this.cart = new Cart()
    }

    execute() {
        this.cart.addProduct(this.product)
    }

    undo() {
        this.cart.removeProduct(this.product.id)
    }
    clone() {
        return new AddProductToCartCommand(this.product)
    }
}

export class RemoveProductFromCartCommand implements Command {
    private productId: string
    private removedProduct: ProductType | null
    private cart: Cart
    constructor(productId: string) {
        this.cart = new Cart()
        this.productId = productId
        this.removedProduct = null
    }

    execute() {
        this.removedProduct = this.cart.removeProduct(this.productId)
    }

    undo() {
        if (!this.removedProduct) { return }
        this.cart.addProduct(this.removedProduct)
    }
    clone() {
        return new RemoveProductFromCartCommand(this.productId)
    }
}

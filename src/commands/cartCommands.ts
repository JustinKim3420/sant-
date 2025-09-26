import { Cart } from "../clients/cart"
import { ProductType } from "../clients/product"
import { Command } from "./executer"

export class AddProductToCartCommand implements Command {
    private product: ProductType
    private cart: Cart
    constructor(product: ProductType) {
        this.product = product
        this.cart = Cart.getInstance()
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
    private cart: Cart
    private removedProduct: ProductType | null
    constructor(productId: string) {
        this.productId = productId
        this.cart = Cart.getInstance()
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

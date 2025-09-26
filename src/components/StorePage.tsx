import { Box } from "@mui/material"
import { useRef, useState } from "react"
import { Cart, CartItemType } from "../clients/cart"
import { Discount, DiscountType } from "../clients/discount"
import { Product } from "../clients/product"
import { CommandExecuter } from "../commands/executer"
import PageHeader from "./PageHeader"
import ShoppingCart from "./ShoppingCart"
import StoreItems from "./StoreItems"

const StorePage = () => {
    const products = Product.getAll()
    const [cart, setCart] = useState<CartItemType[]>(() => Cart.get())
    const [discounts, setDiscounts] = useState<DiscountType[]>(() => Discount.get())
    const commandExecuter = useRef(new CommandExecuter())
    return <Box>
        <PageHeader title={`${products.length} Products`} />
        <StoreItems setCart={setCart} commandExecuter={commandExecuter.current} />
        <ShoppingCart setDiscounts={setDiscounts} cart={cart} commandExecuter={commandExecuter.current} />
        {/* <Discounts/> */}
    </Box>
}

export default StorePage
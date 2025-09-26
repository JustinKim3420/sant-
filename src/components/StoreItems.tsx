import { Box, Button, Card, CardActions, CardContent, Toolbar, Typography } from "@mui/material"
import { Dispatch, SetStateAction, useRef, useState } from "react"
import { Cart, CartItemType } from "../clients/cart"
import { Product } from "../clients/product"
import { AddProductToCartCommand } from "../commands/cartCommands"
import { CommandExecuter } from "../commands/executer"

type StoreItemsProps = {
    setCart: Dispatch<SetStateAction<CartItemType[]>>
    commandExecuter: CommandExecuter
}

const StoreItems = (props: StoreItemsProps) => {
    const products = Product.getAll()
    const { setCart, commandExecuter } = props
    return <>
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}
        >
            <Box>
                <Button
                    onClick={() => {
                        commandExecuter.undo()
                        setCart(Cart.get())
                    }}
                >
                    Undo action
                </Button>
                <Button
                    onClick={() => {
                        commandExecuter.redo()
                        setCart(Cart.get())
                    }}
                >
                    Redo action
                </Button>
            </Box>
            <Typography>Total: {Cart.getTotal()}</Typography>
        </Box>
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem'
            }}
        >

            {
                products.map(product => {
                    return <Card
                        key={product.id}
                        sx={{
                            flex: '1 1 4rem'
                        }}
                    >
                        <CardContent
                            sx={{
                                flexDirection: 'column'
                            }}
                        >
                            <Typography variant='h6' fontWeight={900}>{product.name}</Typography>
                            <Typography variant='h6'>${product.sellingPrice}</Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={() => {
                                const addCommand = new AddProductToCartCommand(product)
                                commandExecuter.execute(addCommand)
                                setCart(Cart.get())
                            }}>
                                Add to cart
                            </Button>
                        </CardActions>
                    </Card>
                })
            }
        </Box>
    </>
}

export default StoreItems
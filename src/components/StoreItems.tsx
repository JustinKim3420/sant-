import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material"
import { Dispatch, SetStateAction } from "react"
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
    const cart = new Cart()
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
                {/* TODO: move to parent */}
                <Button
                    variant='outlined'
                    sx={{
                        marginRight: '0.5rem'
                    }}
                    onClick={() => {
                        commandExecuter.undo()
                        setCart(cart.getAllItems())
                    }}
                >
                    Undo action
                </Button>
                <Button
                    variant='outlined'
                    onClick={() => {
                        commandExecuter.redo()
                        setCart(cart.getAllItems())
                    }}
                >
                    Redo action
                </Button>
            </Box>
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
                                setCart(cart.getAllItems())
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
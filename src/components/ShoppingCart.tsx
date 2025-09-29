import { Badge, Box, Button, Checkbox, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { Dispatch, SetStateAction, useState } from "react"
import { Cart, CartItemType } from "../clients/cart"
import { Discount, DiscountType } from "../clients/discount"
import { RemoveDiscountFromItemCommand } from "../commands/discountCommands"
import { CommandExecuter } from "../commands/executer"
import CreateDiscountModal from "./CreateDiscountModal"
import PaymentModal from "./PaymentModal"

type ShoppingCartProps = {
    cart: CartItemType[],
    setDiscounts: Dispatch<SetStateAction<DiscountType[]>>
    commandExecuter: CommandExecuter
}

const ShoppingCart = (props: ShoppingCartProps) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const cartClass = new Cart()
    const discountClass = new Discount()
    const { cart, commandExecuter, setDiscounts } = props

    return <Box
        sx={{
            marginTop: '1rem',
            border: '0.1rem solid black',
            borderRadius: '1rem',
            padding: '1rem'
        }}
    >
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between'
            }}
        >
            <Typography variant="h4">Shopping cart</Typography>
            <CreateDiscountModal
                setDiscounts={setDiscounts}
                selectedIds={selectedItems}
                commandExecuter={commandExecuter}
            />
        </Box>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Item Name</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Applied Discounts</TableCell>
                        <TableCell align="right">Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cart.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell component="th" scope="row">
                                <Checkbox
                                    color="primary"
                                    checked={selectedItems.includes(item.id)}
                                    onClick={() => {
                                        if (selectedItems.includes(item.id)) {
                                            setSelectedItems(prev => prev.filter((id) => id !== item.id))
                                        } else {
                                            setSelectedItems(prev => [...prev, item.id])
                                        }
                                    }}
                                />
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {item.name}
                            </TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">{discountClass.getDiscountsForProduct(item.id).map(discount => {
                                return <Chip
                                    key={discount.id}
                                    label={`${discount.name} - ${discount.percentAmount}%`}
                                    onDelete={() => {
                                        const command = new RemoveDiscountFromItemCommand(discount.id, item.id)
                                        commandExecuter.execute(command)
                                        setDiscounts(discountClass.get())
                                    }}
                                />
                            })}</TableCell>
                            <TableCell align="right">{cartClass.getProductTotal(item.id)}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell>Sales Tax</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell align="right">{Cart.getSalesTax()}%</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell align="right">{cartClass.getCartTotal()}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <PaymentModal />
        </TableContainer>
    </Box>
}

export default ShoppingCart
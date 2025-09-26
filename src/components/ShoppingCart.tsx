import { Box, Button, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { Dispatch, SetStateAction, useRef, useState } from "react"
import { Cart, CartItemType } from "../clients/cart"
import { DiscountType } from "../clients/discount"
import { CommandExecuter } from "../commands/executer"
import CreateDiscountModal from "./CreateDiscountModal"

type ShoppingCartProps = {
    cart: CartItemType[],
    setDiscounts: Dispatch<SetStateAction<DiscountType[]>>
    commandExecuter: CommandExecuter
}

const ShoppingCart = (props: ShoppingCartProps) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const { cart, commandExecuter, setDiscounts } = props

    return <>
        {
            selectedItems.length > 0
                ? <CreateDiscountModal setDiscounts={setDiscounts} selectedIds={selectedItems} commandExecuter={commandExecuter} />
                : <></>
        }
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Item Name</TableCell>
                        <TableCell align="right">Quantity</TableCell>
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
                                            setSelectedItems(prev => prev.filter((id) => id != item.id))
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
                            <TableCell align="right">{Math.floor(item.sellingPrice * item.quantity * 100) / 100}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>
}

export default ShoppingCart
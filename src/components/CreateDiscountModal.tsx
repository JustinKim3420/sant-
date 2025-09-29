import { Box, Button, Modal, TextField } from "@mui/material"
import { Dispatch, SetStateAction, useState } from "react"
import { Discount, DiscountType } from "../clients/discount"
import { AddItemDiscountCommand } from "../commands/discountCommands"
import { CommandExecuter } from "../commands/executer"

const DEFAULT_DISCOUNT_NAME = null
const DEFAULT_DISCOUNT_PERCENTAGE_AMOUNT = 0

type CreateDiscountModalProps = {
    selectedIds: string[]
    setDiscounts: Dispatch<SetStateAction<DiscountType[]>>
    commandExecuter: CommandExecuter
}

// just stole this from the mui documentation
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const CreateDiscountModal = (props: CreateDiscountModalProps) => {
    const [openModal, setOpenModal] = useState(false)
    const { selectedIds, commandExecuter, setDiscounts } = props
    const [discountName, setDiscountName] = useState<string | null>(DEFAULT_DISCOUNT_NAME)
    const [discountAmount, setDiscountAmount] = useState<number>(DEFAULT_DISCOUNT_PERCENTAGE_AMOUNT)
    const handleDismmiss = () => {
        setOpenModal(false)
        setDiscountName(DEFAULT_DISCOUNT_NAME)
        setDiscountAmount(DEFAULT_DISCOUNT_PERCENTAGE_AMOUNT)
    }
    return <>
        <Button disabled={selectedIds.length === 0} onClick={() => { setOpenModal(true) }}>Create discount for items</Button>
        <Modal
            open={openModal}
            onClose={() => { handleDismmiss() }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    ...style
                }}
            >
                <TextField
                    label="Discount name"
                    variant="standard"
                    value={discountName ?? ""}
                    onChange={(e) => { setDiscountName(e.target.value) }}
                />
                <TextField
                    label="Discount amount"
                    variant="standard"
                    value={discountAmount ?? ""}
                    onChange={(e) => {
                        const value = e.target.value
                        if (isNaN(Number(value))) { return }
                        setDiscountAmount(Number(value))
                    }}
                />
                <Button
                    onClick={() => {
                        if (!discountName) { return }
                        const command = new AddItemDiscountCommand(discountName, discountAmount, selectedIds)
                        commandExecuter.execute(command)
                        setDiscounts(Discount.get())
                        handleDismmiss()
                    }}
                    disabled={discountAmount === DEFAULT_DISCOUNT_PERCENTAGE_AMOUNT || discountName === DEFAULT_DISCOUNT_NAME}
                >
                    Create discount
                </Button>
            </Box>
        </Modal>
    </>
}

export default CreateDiscountModal
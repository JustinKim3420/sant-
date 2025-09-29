import { Box, Button, TextField } from "@mui/material"
import { Dispatch, SetStateAction, useState } from "react"
import { createPayment, PaymentContext, StoredPayment } from "../../clients/payment"
import { CommandExecuter } from "../../commands/executer"
import { AddPaymentCommand } from "../../commands/paymentCommands"

type GiftCardPaymentFormProps = {
    commandExecuter: CommandExecuter
    setPayments: Dispatch<SetStateAction<StoredPayment[]>>
}

const GiftCardPaymentForm = (props: GiftCardPaymentFormProps) => {
    const [amount, setAmount] = useState(0)
    const [serialNumber, setSerialNumber] = useState("")
    const { commandExecuter, setPayments } = props
    const paymentContext = new PaymentContext()

    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column'
        }}
    >
        <TextField
            label="Serial number"
            variant="standard"
            value={serialNumber}
            onChange={(e) => {
                setSerialNumber(e.target.value)
            }}
        />
        <TextField
            label="Amount"
            variant="standard"
            value={amount ?? ""}
            onChange={(e) => {
                const value = e.target.value
                if (isNaN(Number(value))) { return }
                setAmount(Number(value))
            }}
        />
        <Button
            variant="outlined"
            onClick={() => {
                const payment = createPayment({
                    type: 'giftCard',
                    serialNumber
                })
                const command = new AddPaymentCommand(payment, amount)
                commandExecuter.execute(command)
                setPayments(paymentContext.getPayments())
            }}
        >
            Add payment
        </Button>
    </Box>
}

export default GiftCardPaymentForm
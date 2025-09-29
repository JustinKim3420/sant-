import { Box, Button, TextField } from "@mui/material"
import { Dispatch, SetStateAction, useState } from "react"
import { createPayment, PaymentContext, StoredPayment } from "../../clients/payment"
import { CommandExecuter } from "../../commands/executer"
import { AddPaymentCommand } from "../../commands/paymentCommands"

type CreditCardPaymentFormProps = {
    commandExecuter: CommandExecuter
    setPayments: Dispatch<SetStateAction<StoredPayment[]>>
}

const CreditCardPaymentForm = (props: CreditCardPaymentFormProps) => {
    const { commandExecuter, setPayments } = props
    const [amount, setAmount] = useState(0)
    const [cardNumber, setCardNumber] = useState("")
    const [cvv, setCvv] = useState("")
    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column'
        }}
    >
        <TextField
            label='Card number'
            value={cardNumber ?? ""}
            onChange={(e) => {
                setCardNumber(e.target.value)
            }}
        />
        <TextField
            label='CVV'
            value={cvv ?? ""}
            onChange={(e) => {
                setCvv(e.target.value)
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
            onClick={() => {
                const payment = createPayment({
                    type: 'creditCard',
                    cardNumber,
                    cvv
                })
                const command = new AddPaymentCommand(payment, amount)
                commandExecuter.execute(command)
                setPayments(PaymentContext.getPayments())
            }}
        >
            Add payment
        </Button>
    </Box>
}

export default CreditCardPaymentForm
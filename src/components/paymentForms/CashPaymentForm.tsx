import { Box, Button, TextField } from "@mui/material"
import { Dispatch, SetStateAction, useState } from "react"
import { createPayment, PaymentContext, StoredPayment } from "../../clients/payment"
import { CommandExecuter } from "../../commands/executer"
import { AddPaymentCommand } from "../../commands/paymentCommands"

type CashPaymentFormProps = {
    commandExecuter: CommandExecuter
    setPayments: Dispatch<SetStateAction<StoredPayment[]>>
}

const CashPaymentForm = (props: CashPaymentFormProps) => {
    const [amount, setAmount] = useState(0)
    const paymentContext = new PaymentContext()
    const { commandExecuter, setPayments } = props
    return <Box
        sx={{
            display: 'flex',
            flexDirection: 'column'
        }}
    >
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
                    type: 'cash'
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

export default CashPaymentForm
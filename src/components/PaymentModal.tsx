import { Box, Button, MenuItem, Modal, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useRef, useState } from "react"
import { PaymentConfig, PaymentContext, PaymentOptions } from "../clients/payment";
import { CommandExecuter } from "../commands/executer";
import { RemovePaymentCommand } from "../commands/paymentCommands";
import PaymentForm from "./paymentForms/PaymentForm";

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

const PaymentModal = () => {
    const [open, setOpen] = useState(false)
    const [selectedPaymentType, setSelectedPaymentType] = useState<keyof typeof PaymentOptions>('Credit card')
    const paymentsContext = new PaymentContext()
    const [payments, setPayments] = useState(paymentsContext.getPayments())
    const commandExecuter = useRef(new CommandExecuter())
    const paymentTable = <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell align="right">Payment Type</TableCell>
                    <TableCell align="right">Amount</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    payments.map((payment) => {
                        return <TableRow key={payment.id}>
                            <TableCell align="right">{payment.payment.paymentType}</TableCell>
                            <TableCell align="right">{payment.amount}</TableCell>
                            <TableCell align="right">
                                <Button
                                    onClick={() => {
                                        const command = new RemovePaymentCommand(payment.id)
                                        commandExecuter.current.execute(command)
                                        setPayments(paymentsContext.getPayments())
                                    }}
                                >
                                    Remove
                                </Button>
                            </TableCell>
                        </TableRow>
                    })
                }
            </TableBody>
        </Table>
    </TableContainer>

    return <>
        <Button
            onClick={() => { setOpen(true) }}
            variant='outlined'
            sx={{
                float: 'right',
                marginTop: '1rem'
            }}
        >
            Make Payments
        </Button>
        <Modal
            open={open}
            onClose={() => {
                setOpen(false)
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    ...style
                }}
            >
                {
                    payments.length > 0
                        ? paymentTable
                        : <></>
                }
                <Select
                    value={selectedPaymentType}
                    onChange={(event) => {
                        setSelectedPaymentType(event.target.value as keyof typeof PaymentOptions)
                    }}
                >
                    {
                        Object.keys(PaymentOptions).map((key) => {
                            return <MenuItem key={key} value={key as keyof typeof PaymentOptions}>{key}</MenuItem>
                        })
                    }
                </Select>
                <PaymentForm
                    paymentType={selectedPaymentType}
                    setPayments={setPayments}
                    commandExecuter={commandExecuter.current}
                />
                <Button
                    variant='outlined'
                    onClick={() => {
                        commandExecuter.current.undo()
                        setPayments(paymentsContext.getPayments())
                    }}
                >
                    Undo
                </Button>
                <Button
                    variant='outlined'
                    onClick={() => {
                        commandExecuter.current.redo()
                        setPayments(paymentsContext.getPayments())
                    }}
                >
                    Redo
                </Button>
                <Button
                    variant='outlined'
                    onClick={() => {
                        paymentsContext.submitPayments()
                    }}
                >
                    Submit all payments
                </Button>
            </Box>
        </Modal>
    </>
}
export default PaymentModal
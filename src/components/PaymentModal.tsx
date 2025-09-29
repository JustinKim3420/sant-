import { Box, Button, MenuItem, Modal, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useState } from "react"
import { PaymentConfig, PaymentContext, PaymentOptions } from "../clients/payment";
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
    const [payments, setPayments] = useState(PaymentContext.getPayments())

    const paymentTable = <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell />
                    <TableCell>Payment Type</TableCell>
                    <TableCell align="right">Amount</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    payments.map((payment) => {
                        return <TableRow key={payment.id}>
                            <TableRow>{payment.payment.getPaymentType()}</TableRow>
                            <TableRow>{payment.amount}</TableRow>
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
                />
            </Box>
        </Modal>
    </>
}
export default PaymentModal
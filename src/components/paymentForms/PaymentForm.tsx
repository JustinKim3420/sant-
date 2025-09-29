import { Box, Button, TextField } from "@mui/material";
import { Dispatch, ReactElement, SetStateAction, useState } from "react";
import { PaymentConfig, PaymentOptions, StoredPayment } from "../../clients/payment";
import { CommandExecuter } from "../../commands/executer";
import CashPaymentForm from "./CashPaymentForm";
import CreditCardPaymentForm from "./CreditCardPaymentForm";
import GiftCardPaymentForm from "./GiftCardPaymentForm";
import KlarnaPaymentForm from "./KlarnaPaymentForm";

type PaymentFormProps = {
    paymentType: keyof typeof PaymentOptions
    setPayments: Dispatch<SetStateAction<StoredPayment[]>>
    commandExecuter: CommandExecuter
}


const PaymentForm = (props: PaymentFormProps) => {
    const { paymentType, setPayments, commandExecuter } = props
    const paymentFormMap: Record<keyof typeof PaymentOptions, ReactElement> = {
        'Credit card': <CreditCardPaymentForm commandExecuter={commandExecuter} setPayments={setPayments} />,
        'Gift card': <GiftCardPaymentForm commandExecuter={commandExecuter} setPayments={setPayments} />,
        'Cash': <CashPaymentForm commandExecuter={commandExecuter} setPayments={setPayments} />,
        'Klarna': <KlarnaPaymentForm commandExecuter={commandExecuter} setPayments={setPayments} />
    }

    return <Box>
        {paymentFormMap[paymentType]}
    </Box>
}
export default PaymentForm
import { Payment, PaymentContext, StoredPayment } from "../clients/payment";
import { Command } from "./executer";

export class AddPaymentCommand implements Command {
    payment: Payment
    amount: number
    addedPayment: StoredPayment | null = null
    constructor(payment: Payment, amount: number) {
        this.payment = payment
        this.amount = amount
    }
    execute() {
        this.addedPayment = PaymentContext.addPayment(this.payment, this.amount)
    }
    undo() {
        if (!this.addedPayment) { return }
        PaymentContext.removePayment(this.addedPayment.id)
        this.addedPayment = null
    }
    clone() {
        return new AddPaymentCommand(this.payment, this.amount)
    }
}
export class RemovePaymentCommand implements Command {
    paymentId: string
    removedPayment: StoredPayment | null = null
    constructor(paymentId: string) {
        this.paymentId = paymentId
    }
    execute() {
        this.removedPayment = PaymentContext.removePayment(this.paymentId)
    }
    undo() {
        if (!this.removedPayment) { return }
        PaymentContext.readdPayment(this.removedPayment)
        this.removedPayment = null
    }
    clone() {
        return new RemovePaymentCommand(this.paymentId)
    }
}
import { Payment, PaymentContext, StoredPayment } from "../clients/payment";
import { Command } from "./executer";

export class AddPaymentCommand implements Command {
    payment: Payment
    amount: number
    addedPayment: StoredPayment | null = null
    paymentContext: PaymentContext
    constructor(payment: Payment, amount: number) {
        this.payment = payment
        this.amount = amount
        this.paymentContext = new PaymentContext()
    }
    execute() {
        this.addedPayment = this.paymentContext.addPayment(this.payment, this.amount)
    }
    undo() {
        if (!this.addedPayment) { return }
        this.paymentContext.removePayment(this.addedPayment.id)
        this.addedPayment = null
    }
    clone() {
        return new AddPaymentCommand(this.payment, this.amount)
    }
}
export class RemovePaymentCommand implements Command {
    paymentId: string
    removedPayment: StoredPayment | null = null
    paymentContext: PaymentContext
    constructor(paymentId: string) {
        this.paymentId = paymentId
        this.paymentContext = new PaymentContext()
    }
    execute() {
        this.removedPayment = this.paymentContext.removePayment(this.paymentId)
    }
    undo() {
        if (!this.removedPayment) { return }
        this.paymentContext.readdPayment(this.removedPayment)
        this.removedPayment = null
    }
    clone() {
        return new RemovePaymentCommand(this.paymentId)
    }
}
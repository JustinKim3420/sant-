// Should implement a transaction type system

import { Console } from "console"
import Decimal from "decimal.js"
import { Cart } from "./cart"
import LocalStorage from "./localStorageClient"

export enum PaymentOptions {
    "Credit card" = 'creditCard',
    "Gift card" = 'giftCard',
    "Cash" = 'cash',
    "Klarna" = 'klarna'
}

// If any single payment fails, all payments be rescinded 
export abstract class Payment {
    public paymentType!: keyof typeof PaymentOptions
    abstract makePayment(amount: number): void

}

export type PaymentConfig =
    | { type: 'creditCard', cardNumber: string, cvv: string }
    | { type: 'giftCard', serialNumber: string }
    | { type: 'cash' }
    | { type: 'klarna', accountId: string }

type PaymentFactoryMap = {
    creditCard: (params: Extract<PaymentConfig, { type: 'creditCard' }>) => Payment,
    giftCard: (params: Extract<PaymentConfig, { type: 'giftCard' }>) => Payment,
    cash: (params: Extract<PaymentConfig, { type: 'cash' }>) => Payment,
    klarna: (params: Extract<PaymentConfig, { type: 'klarna' }>) => Payment
}
const paymentRegistry: PaymentFactoryMap = {
    creditCard: (config) => new CreditCardPayment(config.cardNumber, config.cvv),
    giftCard: (config) => new GiftCardPayment(config.serialNumber),
    cash: (config) => new CashPayment(),
    klarna: (config) => new KlarnaPayment(config.accountId),
}

export const createPayment = <T extends PaymentConfig["type"]>(
    config: Extract<PaymentConfig, { type: T }>
): Payment => {
    return paymentRegistry[config.type](config as any) // should be a better way to type this
}

class CreditCardPayment extends Payment {
    private cardNumber: string
    private cvv: string
    public paymentType = 'Credit card' as keyof typeof PaymentOptions
    constructor(cardNumber: string, cvv: string) {
        super()
        this.cardNumber = cardNumber
        this.cvv = cvv
    }
    makePayment(amount: number) {
        console.log('Payment made to card number:', this.cardNumber)
    }
}

class GiftCardPayment extends Payment {
    serialNumber: string
    public paymentType = 'Gift card' as keyof typeof PaymentOptions
    constructor(serialNumber: string) {
        super()
        this.serialNumber = serialNumber
    }
    makePayment(amount: number) {
        console.log('Payment made using gift card with UID:', this.serialNumber)
    }
}

class CashPayment extends Payment {
    public paymentType = 'Cash' as keyof typeof PaymentOptions

    constructor() {
        super()
    }
    makePayment(amount: number) {
        console.log('Payment using cash of amount:', amount)
    }
}

class KlarnaPayment extends Payment {
    accountId: string
    public paymentType = 'Klarna' as keyof typeof PaymentOptions
    constructor(accountId: string) {
        super()
        this.accountId = accountId
    }
    makePayment(amount: number) {
        console.log('Payment using Klarna:', amount)
    }
}

export type StoredPayment = {
    id: string,
    amount: number,
    payment: Payment
}

export class PaymentContext {
    static readonly LOCAL_STORAGE_KEY = 'payments'

    constructor() {
        this._initializePayments()
    }

    private _initializePayments() {
        LocalStorage.createIfNotExist(PaymentContext.LOCAL_STORAGE_KEY, [])
    }
    private static generatePaymentId() {
        return Date.now().toString()
    }
    getPayments() {
        const data = LocalStorage.get(PaymentContext.LOCAL_STORAGE_KEY) as StoredPayment[]
        return data
    }
    readdPayment(payment: StoredPayment) {
        const existingPayments = this.getPayments()
        LocalStorage.create(PaymentContext.LOCAL_STORAGE_KEY, [...existingPayments, payment])
    }
    addPayment(payment: Payment, amount: number): StoredPayment {
        const existingPayments = this.getPayments()
        const paymentId = PaymentContext.generatePaymentId()
        const newPayment = {
            id: paymentId,
            amount,
            payment
        }
        LocalStorage.create(PaymentContext.LOCAL_STORAGE_KEY, [...existingPayments, newPayment])
        return newPayment
    }
    removePayment(paymentId: string) {
        const existingPayments = this.getPayments()
        let removedPayment: StoredPayment | null = null
        const newPayments = existingPayments.filter(payment => {
            const isRemovedPayment = payment.id === paymentId
            if (isRemovedPayment) {
                removedPayment = payment
            }
            return !isRemovedPayment
        })
        LocalStorage.create(PaymentContext.LOCAL_STORAGE_KEY, newPayments)
        return removedPayment
    }
    // Implement never throw or something to properly hanle all errors
    submitPayments() {
        const cart = new Cart()
        const cartTotal = new Decimal(cart.getCartTotal())
        const payments = this.getPayments()
        const paymentTotal = payments.reduce((acc, cur) => {
            return acc.plus(cur.amount)
        }, new Decimal(0))

        const amountOwed = cartTotal.minus(paymentTotal).toNumber()
        if (amountOwed === 0) {
            console.log('PAYMENT SUCCESSFUL')
        } else if (amountOwed > 0) {
            console.log('You need to add additional payments')
        } else {
            console.log('Update previous payments to get the exact total')
        }
    }
}
// Should implement a transaction type system

import LocalStorage from "./localStorageClient"

export enum PaymentOptions {
    "Credit card" = 'creditCard',
    "Gift card" = 'giftCard',
    "Cash" = 'cash',
    "Klarna" = 'klarna'
}

// If any single payment fails, all payments be rescinded 
export abstract class Payment {
    abstract makePayment(amount: number): void
    abstract getPaymentType(): PaymentOptions
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
    constructor(cardNumber: string, cvv: string) {
        super()
        this.cardNumber = cardNumber
        this.cvv = cvv
    }
    makePayment(amount: number) {
        console.log('Payment made to card number:', this.cardNumber)
    }
    getPaymentType() {
        return PaymentOptions["Credit card"]
    }
}

class GiftCardPayment extends Payment {
    serialNumber: string
    constructor(serialNumber: string) {
        super()
        this.serialNumber = serialNumber
    }
    makePayment(amount: number) {
        console.log('Payment made using gift card with UID:', this.serialNumber)
    }

    getPaymentType() {
        return PaymentOptions["Gift card"]
    }
}

class CashPayment extends Payment {
    constructor() {
        super()
    }
    makePayment(amount: number) {
        console.log('Payment using cash of amount:', amount)
    }

    getPaymentType() {
        return PaymentOptions["Cash"]
    }
}

class KlarnaPayment extends Payment {
    accountId: string
    constructor(accountId: string) {
        super()
        this.accountId = accountId
    }
    makePayment(amount: number) {
        console.log('Payment using Klarna:', amount)
    }
    getPaymentType() {
        return PaymentOptions["Klarna"]
    }
}

export type StoredPayment = {
    id: string,
    amount: number,
    payment: Payment
}

export class PaymentContext {
    static readonly LOCAL_STORAGE_KEY = 'payments'
    private static isInitialized = false
    private static _initializePayments() {
        LocalStorage.createIfNotExist(PaymentContext.LOCAL_STORAGE_KEY, [])
        PaymentContext.isInitialized = true
    }
    private static generatePaymentId() {
        return Date.now().toString()
    }
    static getPayments() {
        if (!PaymentContext.isInitialized) {
            PaymentContext._initializePayments()
        }
        const data = LocalStorage.get(PaymentContext.LOCAL_STORAGE_KEY) as StoredPayment[]
        return data
    }
    static readdPayment(payment: StoredPayment) {
        const existingPayments = PaymentContext.getPayments()
        LocalStorage.create(PaymentContext.LOCAL_STORAGE_KEY, [...existingPayments, payment])
    }
    static addPayment(payment: Payment, amount: number): StoredPayment {
        const existingPayments = PaymentContext.getPayments()
        const paymentId = PaymentContext.generatePaymentId()
        const newPayment = {
            id: paymentId,
            amount,
            payment
        }
        console.log('---newPayment', payment)
        LocalStorage.create(PaymentContext.LOCAL_STORAGE_KEY, [...existingPayments, newPayment])
        return newPayment
    }
    static removePayment(paymentId: string) {
        const existingPayments = PaymentContext.getPayments()
        let removedPayment: StoredPayment | null = null
        const newPayments = existingPayments.filter(payment => {
            const isRemovedPayment = payment.id === paymentId
            if (isRemovedPayment) {
                removedPayment = payment
            }
            return !isRemovedPayment
        })
        LocalStorage.create(this.LOCAL_STORAGE_KEY, newPayments)
        return removedPayment
    }
}
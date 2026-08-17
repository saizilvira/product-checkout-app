import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
    CustomerData,
    DeliveryData,
    CardData,
    Transaction,
    CheckoutStep,
} from '@/types'

const BASE_FEE_IN_CENTS = 500000
const DELIVERY_FEE_IN_CENTS = 800000

export const useCheckoutStore = defineStore(
    'checkout',
    () => {
        const step = ref<CheckoutStep>('product')
        const customer = ref<CustomerData | null>(null)
        const delivery = ref<DeliveryData | null>(null)
        const card = ref<CardData | null>(null)
        const transaction = ref<Transaction | null>(null)
        const paymentSourceId = ref<string | null>(null)

        const baseFeeInCents = computed(() => BASE_FEE_IN_CENTS)
        const deliveryFeeInCents = computed(() => DELIVERY_FEE_IN_CENTS)

        const totalInCents = computed(() => {
            const amount = transaction.value?.amountInCents ?? 0
            return amount + BASE_FEE_IN_CENTS + DELIVERY_FEE_IN_CENTS
        })

        function setStep(newStep: CheckoutStep) {
            step.value = newStep
        }

        function setCustomer(data: CustomerData) {
            customer.value = data
        }

        function setDelivery(data: DeliveryData) {
            delivery.value = data
        }

        function setCard(data: CardData) {
            card.value = {
                ...data,
                lastFour: data.number.slice(-4),
            }
        }

        function setTransaction(data: Transaction) {
            transaction.value = data
        }

        function setPaymentSourceId(token: string) {
            paymentSourceId.value = token
        }

        function reset() {
            step.value = 'product'
            customer.value = null
            delivery.value = null
            card.value = null
            transaction.value = null
            paymentSourceId.value = null
        }

        return {
            step,
            customer,
            delivery,
            card,
            transaction,
            paymentSourceId,
            baseFeeInCents,
            deliveryFeeInCents,
            totalInCents,
            setStep,
            setCustomer,
            setDelivery,
            setCard,
            setTransaction,
            setPaymentSourceId,
            reset,
        }
    },
    {
        persist: {
            key: 'checkout-store',
            storage: localStorage,
            paths: ['step', 'customer', 'delivery', 'card', 'transaction', 'paymentSourceId'],
        },
    },
)
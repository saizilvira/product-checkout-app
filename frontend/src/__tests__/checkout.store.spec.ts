import { setActivePinia, createPinia } from 'pinia'
import { useCheckoutStore } from '@/stores/checkout'

describe('checkout store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('starts at product step', () => {
        const store = useCheckoutStore()
        expect(store.step).toBe('product')
    })

    it('sets customer and delivery', () => {
        const store = useCheckoutStore()
        store.setCustomer({
            fullName: 'Juan Perez',
            email: 'juan@test.com',
        })
        store.setDelivery({
            address: 'Calle 123',
            city: 'Bogota',
        })

        expect(store.customer?.email).toBe('juan@test.com')
        expect(store.delivery?.city).toBe('Bogota')
    })

    it('sets card and extracts lastFour', () => {
        const store = useCheckoutStore()
        store.setCard({
            number: '4242424242424242',
            expMonth: '12',
            expYear: '28',
            cvc: '123',
            cardHolder: 'JUAN PEREZ',
            brand: 'VISA',
        })

        expect(store.card?.lastFour).toBe('4242')
        expect(store.card?.brand).toBe('VISA')
    })

    it('resets all state', () => {
        const store = useCheckoutStore()
        store.setStep('summary')
        store.setCustomer({ fullName: 'A', email: 'a@a.com' })
        store.reset()

        expect(store.step).toBe('product')
        expect(store.customer).toBeNull()
        expect(store.card).toBeNull()
        expect(store.transaction).toBeNull()
    })

    it('exposes fixed fees', () => {
        const store = useCheckoutStore()
        expect(store.baseFeeInCents).toBe(500000)
        expect(store.deliveryFeeInCents).toBe(800000)
    })
})
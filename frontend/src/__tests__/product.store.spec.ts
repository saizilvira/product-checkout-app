import { setActivePinia, createPinia } from 'pinia'
import { useProductStore } from '@/stores/product'

jest.mock('@/services/api', () => ({
    api: {
        get: jest.fn(),
    },
}))

import { api } from '../services/api'

describe('product store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        jest.clearAllMocks()
    })

    it('fetches product successfully', async () => {
        ; (api.get as jest.Mock).mockResolvedValue({
            data: {
                id: '1',
                name: 'Test',
                description: 'Desc',
                priceInCents: 10000,
                stock: 5,
            },
        })

        const store = useProductStore()
        await store.fetchProduct()

        expect(store.product?.name).toBe('Test')
        expect(store.hasStock).toBe(true)
        expect(store.loading).toBe(false)
    })

    it('handles fetch error', async () => {
        ; (api.get as jest.Mock).mockRejectedValue(new Error('network'))

        const store = useProductStore()
        await store.fetchProduct()

        expect(store.product).toBeNull()
        expect(store.error).toBeTruthy()
    })
})
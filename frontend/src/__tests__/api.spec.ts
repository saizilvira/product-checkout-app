import { api } from '@/services/api'

describe('api client', () => {
    it('has baseURL configured', () => {
        expect(api.defaults.baseURL).toBeTruthy()
    })
})
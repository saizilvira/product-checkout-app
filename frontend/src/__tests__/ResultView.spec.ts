import { mount } from '@vue/test-utils'
import ResultView from '@/views/ResultView.vue'
import { useProductStore } from '@/stores/product'
import { useCheckoutStore } from '@/stores/checkout'
import { useRouter } from 'vue-router'

jest.mock('vue-router', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/stores/product', () => ({
  useProductStore: jest.fn()
}))

jest.mock('@/stores/checkout', () => ({
  useCheckoutStore: jest.fn()
}))

describe('ResultView.vue', () => {
  let pushMock: jest.Mock
  let replaceMock: jest.Mock
  let fetchProductMock: jest.Mock
  let resetMock: jest.Mock

  beforeEach(() => {
    pushMock = jest.fn()
    replaceMock = jest.fn()
    fetchProductMock = jest.fn().mockResolvedValue(undefined)
    resetMock = jest.fn()

    ;(useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
      replace: replaceMock
    })

    ;(useProductStore as unknown as jest.Mock).mockReturnValue({
      fetchProduct: fetchProductMock
    })

    ;(useCheckoutStore as unknown as jest.Mock).mockReturnValue({
      transaction: {
        reference: 'txn_123',
        status: 'APPROVED',
        totalInCents: 11500
      },
      reset: resetMock
    })
  })

  it('redirects to product if no transaction exists on mount', () => {
    ;(useCheckoutStore as unknown as jest.Mock).mockReturnValue({
      transaction: null,
      reset: resetMock
    })

    mount(ResultView)
    expect(replaceMock).toHaveBeenCalledWith({ name: 'product' })
  })

  it('renders APPROVED state correctly', () => {
    const wrapper = mount(ResultView)
    
    expect(wrapper.text()).toContain('Pago aprobado')
    expect(wrapper.text()).toContain('txn_123')
    expect(wrapper.text()).toContain('APPROVED')
  })

  it('renders DECLINED state correctly', () => {
    ;(useCheckoutStore as unknown as jest.Mock).mockReturnValue({
      transaction: {
        reference: 'txn_456',
        status: 'DECLINED',
        totalInCents: 11500
      },
      reset: resetMock
    })

    const wrapper = mount(ResultView)
    
    expect(wrapper.text()).toContain('Pago declinado')
  })

  it('renders ERROR state correctly', () => {
    ;(useCheckoutStore as unknown as jest.Mock).mockReturnValue({
      transaction: {
        reference: 'txn_789',
        status: 'ERROR',
        totalInCents: 11500
      },
      reset: resetMock
    })

    const wrapper = mount(ResultView)
    
    expect(wrapper.text()).toContain('Error en el pago')
  })

  it('handles go to product action', async () => {
    const wrapper = mount(ResultView)
    
    const backButton = wrapper.findAll('button').filter(b => b.text().includes('Volver al producto'))[0]
    await backButton.trigger('click')
    
    expect(resetMock).toHaveBeenCalled()
    expect(fetchProductMock).toHaveBeenCalled()
    expect(pushMock).toHaveBeenCalledWith({ name: 'product' })
  })
})

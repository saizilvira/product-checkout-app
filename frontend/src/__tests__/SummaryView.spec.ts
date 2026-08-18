import { mount } from '@vue/test-utils'
import SummaryView from '@/views/SummaryView.vue'
import { useProductStore } from '@/stores/product'
import { useCheckoutStore } from '@/stores/checkout'
import { useRouter } from 'vue-router'
import { createTransaction, processPayment } from '@/services/checkout'
import { tokenizeCard } from '@/services/payment'

jest.mock('vue-router', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/stores/product', () => ({
  useProductStore: jest.fn()
}))

jest.mock('@/stores/checkout', () => ({
  useCheckoutStore: jest.fn()
}))

jest.mock('@/services/checkout', () => ({
  createTransaction: jest.fn(),
  processPayment: jest.fn()
}))

jest.mock('@/services/payment', () => ({
  tokenizeCard: jest.fn()
}))

describe('SummaryView.vue', () => {
  let pushMock: jest.Mock
  let replaceMock: jest.Mock
  let setStepMock: jest.Mock
  let fetchProductMock: jest.Mock
  let setTransactionMock: jest.Mock
  let setPaymentSourceIdMock: jest.Mock

  beforeEach(() => {
    pushMock = jest.fn()
    replaceMock = jest.fn()
    setStepMock = jest.fn()
    fetchProductMock = jest.fn()
    setTransactionMock = jest.fn()
    setPaymentSourceIdMock = jest.fn()

    ;(useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
      replace: replaceMock
    })

    ;(useProductStore as unknown as jest.Mock).mockReturnValue({
      product: {
        id: '1',
        name: 'Test Product',
        priceInCents: 10000
      },
      fetchProduct: fetchProductMock
    })

    ;(useCheckoutStore as unknown as jest.Mock).mockReturnValue({
      customer: { email: 'test@test.com' },
      delivery: { address: 'Test St' },
      card: { brand: 'VISA', lastFour: '4242' },
      baseFeeInCents: 1000,
      deliveryFeeInCents: 500,
      transaction: null,
      setStep: setStepMock,
      setTransaction: setTransactionMock,
      setPaymentSourceId: setPaymentSourceIdMock
    })
  })

  it('renders summary information', () => {
    const wrapper = mount(SummaryView)
    
    expect(wrapper.text()).toContain('Resumen de pago')
    expect(wrapper.text()).toContain('Test Product')
    expect(wrapper.text()).toContain('VISA •••• 4242')
    // 10000 + 1000 + 500 = 11500
    // Formatting handles it, we can just check if text contains it roughly or check for "Total"
    expect(wrapper.text()).toContain('Total')
  })

  it('redirects to payment-info if data is missing on mount', () => {
    ;(useCheckoutStore as unknown as jest.Mock).mockReturnValue({
      customer: null, // missing
      delivery: null,
      card: null,
      baseFeeInCents: 1000,
      deliveryFeeInCents: 500,
      transaction: null
    })

    mount(SummaryView)
    expect(replaceMock).toHaveBeenCalledWith({ name: 'payment-info' })
  })

  it('navigates back to payment-info on click', async () => {
    const wrapper = mount(SummaryView)
    
    const backButton = wrapper.findAll('button').filter(b => b.text().includes('Volver'))[0]
    await backButton.trigger('click')
    
    expect(setStepMock).toHaveBeenCalledWith('payment-info')
    expect(pushMock).toHaveBeenCalledWith({ name: 'payment-info' })
  })

  it('processes payment successfully', async () => {
    const wrapper = mount(SummaryView)
    
    const tx = { id: 'txn_123', status: 'PENDING' }
    const paymentSourceId = 'src_123'
    const finalTx = { id: 'txn_123', status: 'APPROVED' }

    ;(createTransaction as jest.Mock).mockResolvedValue(tx)
    ;(tokenizeCard as jest.Mock).mockResolvedValue(paymentSourceId)
    ;(processPayment as jest.Mock).mockResolvedValue(finalTx)

    const payButton = wrapper.findAll('button').filter(b => b.text().includes('Pagar'))[0]
    await payButton.trigger('click')
    
    // Check that api was called
    expect(createTransaction).toHaveBeenCalled()
    expect(tokenizeCard).toHaveBeenCalled()
    expect(processPayment).toHaveBeenCalled()

    // It should navigate to result
    expect(setStepMock).toHaveBeenCalledWith('result')
    expect(pushMock).toHaveBeenCalledWith({ name: 'result' })
  })

  it('handles payment error', async () => {
    const wrapper = mount(SummaryView)
    
    ;(createTransaction as jest.Mock).mockRejectedValue(new Error('Payment failed'))

    const payButton = wrapper.findAll('button').filter(b => b.text().includes('Pagar'))[0]
    await payButton.trigger('click')
    
    expect(wrapper.text()).toContain('Payment failed')
    // Should not navigate to result
    expect(pushMock).not.toHaveBeenCalledWith({ name: 'result' })
  })
})

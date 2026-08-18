import { mount } from '@vue/test-utils'
import PaymentInfoView from '@/views/PaymentInfoView.vue'
import { useCheckoutStore } from '@/stores/checkout'
import { useRouter } from 'vue-router'

jest.mock('vue-router', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/stores/checkout', () => ({
  useCheckoutStore: jest.fn()
}))

// Mock components to simplify tests and avoid deep rendering issues
jest.mock('@/components/CreditCardForm.vue', () => ({
  name: 'CreditCardForm',
  template: '<div class="mock-credit-card-form"></div>'
}))
jest.mock('@/components/DeliveryForm.vue', () => ({
  name: 'DeliveryForm',
  template: '<div class="mock-delivery-form"></div>'
}))

describe('PaymentInfoView.vue', () => {
  let pushMock: jest.Mock
  let setStepMock: jest.Mock
  let setCardMock: jest.Mock
  let setCustomerMock: jest.Mock
  let setDeliveryMock: jest.Mock

  beforeEach(() => {
    pushMock = jest.fn()
    setStepMock = jest.fn()
    setCardMock = jest.fn()
    setCustomerMock = jest.fn()
    setDeliveryMock = jest.fn()

    ;(useRouter as jest.Mock).mockReturnValue({
      push: pushMock
    })

    ;(useCheckoutStore as unknown as jest.Mock).mockReturnValue({
      card: null,
      customer: null,
      delivery: null,
      setStep: setStepMock,
      setCard: setCardMock,
      setCustomer: setCustomerMock,
      setDelivery: setDeliveryMock
    })
  })

  it('renders forms initially', () => {
    console.log("PAYMENT INFO VIEW IMPORT:", PaymentInfoView)
    const wrapper = mount(PaymentInfoView)
    
    expect(wrapper.find('.mock-delivery-form').exists()).toBe(true)
    expect(wrapper.text()).toContain('Tarjeta de crédito')
    expect(wrapper.text()).toContain('Ingresa los datos de tu tarjeta')
    
    // Modal should be closed
    expect(wrapper.findComponent({ name: 'BaseModal' }).props('open')).toBe(false)
  })

  it('opens card modal on click', async () => {
    const wrapper = mount(PaymentInfoView)
    
    const cardButton = wrapper.findAll('button').filter(b => b.text().includes('Tarjeta de crédito'))[0]
    await cardButton.trigger('click')
    
    expect(wrapper.findComponent({ name: 'BaseModal' }).props('open')).toBe(true)
  })

  it('navigates back to product view on click', async () => {
    const wrapper = mount(PaymentInfoView)
    
    const backButton = wrapper.findAll('button').filter(b => b.text().includes('Volver'))[0]
    await backButton.trigger('click')
    
    expect(setStepMock).toHaveBeenCalledWith('product')
    expect(pushMock).toHaveBeenCalledWith({ name: 'product' })
  })
})

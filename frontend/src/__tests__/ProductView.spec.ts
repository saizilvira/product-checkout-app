import { mount } from '@vue/test-utils'
import ProductView from '@/views/ProductView.vue'
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

describe('ProductView.vue', () => {
  let pushMock: jest.Mock
  let setStepMock: jest.Mock
  let fetchProductMock: jest.Mock

  beforeEach(() => {
    pushMock = jest.fn()
    setStepMock = jest.fn()
    fetchProductMock = jest.fn()

    ;(useRouter as jest.Mock).mockReturnValue({
      push: pushMock
    })

    ;(useCheckoutStore as unknown as jest.Mock).mockReturnValue({
      setStep: setStepMock
    })
  })

  it('renders loading state', () => {
    ;(useProductStore as unknown as jest.Mock).mockReturnValue({
      loading: true,
      error: null,
      product: null,
      fetchProduct: fetchProductMock
    })

    const wrapper = mount(ProductView)
    expect(wrapper.find('.animate-spin').exists()).toBe(true)
    expect(fetchProductMock).toHaveBeenCalled()
  })

  it('renders error state', () => {
    ;(useProductStore as unknown as jest.Mock).mockReturnValue({
      loading: false,
      error: 'Network Error',
      product: null,
      fetchProduct: fetchProductMock
    })

    const wrapper = mount(ProductView)
    expect(wrapper.text()).toContain('Network Error')
  })

  it('renders product information', () => {
    ;(useProductStore as unknown as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      hasStock: true,
      priceFormatted: '$100.00',
      product: {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        imageUrl: 'http://test.com/img.jpg',
        stock: 10,
        price: { amountInCents: 10000, currency: 'COP' }
      },
      fetchProduct: fetchProductMock
    })

    const wrapper = mount(ProductView)

    expect(wrapper.text()).toContain('Test Product')
    expect(wrapper.text()).toContain('10 disponibles')
    expect(wrapper.text()).toContain('Test Description')
    
    const btn = wrapper.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.attributes('disabled')).toBeUndefined()
  })

  it('disables button when out of stock', () => {
    ;(useProductStore as unknown as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      hasStock: false,
      priceFormatted: '$100.00',
      product: {
        id: '1',
        name: 'Test Product',
        stock: 0,
        price: { amountInCents: 10000, currency: 'COP' }
      },
      fetchProduct: fetchProductMock
    })

    const wrapper = mount(ProductView)

    expect(wrapper.text()).toContain('Agotado')
    const btn = wrapper.find('button')
    expect(btn.attributes('disabled')).toBeDefined()
  })

  it('navigates to checkout on click', async () => {
    ;(useProductStore as unknown as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      hasStock: true,
      priceFormatted: '$100.00',
      product: {
        id: '1',
        name: 'Test Product',
        stock: 10,
        price: { amountInCents: 10000, currency: 'COP' }
      },
      fetchProduct: fetchProductMock
    })

    const wrapper = mount(ProductView)
    await wrapper.find('button').trigger('click')
    
    expect(setStepMock).toHaveBeenCalledWith('payment-info')
    expect(pushMock).toHaveBeenCalledWith({ name: 'payment-info' })
  })
})

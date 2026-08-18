import { mount } from '@vue/test-utils'
import DeliveryForm from '@/components/DeliveryForm.vue'

describe('DeliveryForm.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(DeliveryForm)
    expect(wrapper.text()).toContain('Datos del cliente')
    expect(wrapper.text()).toContain('Datos de entrega')
  })

  it('emits valid: false when incomplete', async () => {
    const wrapper = mount(DeliveryForm)
    const inputs = wrapper.findAll('input')
    
    // Fill only name
    await inputs[0].setValue('Juan Perez')
    
    const validEvents = wrapper.emitted('valid')
    expect(validEvents).toBeTruthy()
    expect(validEvents![validEvents!.length - 1]).toEqual([false])
  })

  it('emits valid: true and updates models when complete', async () => {
    const wrapper = mount(DeliveryForm)
    const inputs = wrapper.findAll('input')
    
    // Fill all required
    await inputs[0].setValue('Juan Perez') // name
    await inputs[1].setValue('juan@test.com') // email
    await inputs[2].setValue('12345678') // phone
    await inputs[3].setValue('Calle 123') // address
    await inputs[4].setValue('Bogota') // city
    await inputs[5].setValue('Cundinamarca') // region
    
    const validEvents = wrapper.emitted('valid')
    expect(validEvents![validEvents!.length - 1]).toEqual([true])

    const customerUpdate = wrapper.emitted('update:customer')
    expect(customerUpdate).toBeTruthy()
    const lastCustomer = customerUpdate![customerUpdate!.length - 1][0] as any
    expect(lastCustomer.fullName).toBe('Juan Perez')
    expect(lastCustomer.email).toBe('juan@test.com')

    const deliveryUpdate = wrapper.emitted('update:delivery')
    expect(deliveryUpdate).toBeTruthy()
    const lastDelivery = deliveryUpdate![deliveryUpdate!.length - 1][0] as any
    expect(lastDelivery.address).toBe('Calle 123')
    expect(lastDelivery.city).toBe('Bogota')
  })
})

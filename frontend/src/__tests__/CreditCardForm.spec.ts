import { mount } from '@vue/test-utils'
import CreditCardForm from '@/components/CreditCardForm.vue'

describe('CreditCardForm.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(CreditCardForm)
    expect(wrapper.text()).toContain('Número de tarjeta')
    expect(wrapper.text()).toContain('Mes')
    expect(wrapper.text()).toContain('Año')
    expect(wrapper.text()).toContain('CVC')
    expect(wrapper.text()).toContain('Titular')
  })

  it('emits events on input', async () => {
    const wrapper = mount(CreditCardForm)
    
    const inputs = wrapper.findAll('input')
    // number
    await inputs[0].setValue('4242424242424242')
    // month
    await inputs[1].setValue('12')
    // year
    await inputs[2].setValue('25')
    // cvc
    await inputs[3].setValue('123')
    // cardHolder
    await inputs[4].setValue('JUAN PEREZ')

    // It emits valid: true and update:modelValue
    const validEvents = wrapper.emitted('valid')
    expect(validEvents).toBeTruthy()
    // The last event should have true
    expect(validEvents![validEvents!.length - 1]).toEqual([true])

    const updateEvents = wrapper.emitted('update:modelValue')
    expect(updateEvents).toBeTruthy()
    const lastUpdatePayload = updateEvents![updateEvents!.length - 1][0] as any
    expect(lastUpdatePayload.number).toBe('4242424242424242')
    expect(lastUpdatePayload.brand).toBe('VISA')
    expect(lastUpdatePayload.lastFour).toBe('4242')
  })

  it('emits valid: false when incomplete', async () => {
    const wrapper = mount(CreditCardForm)
    
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('4242') // Incomplete
    
    const validEvents = wrapper.emitted('valid')
    expect(validEvents![validEvents!.length - 1]).toEqual([false])
  })
})

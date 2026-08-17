<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import type { CustomerData, DeliveryData } from '@/types'

const props = defineProps<{
  customer?: CustomerData | null
  delivery?: DeliveryData | null
}>()

const emit = defineEmits<{
  'update:customer': [value: CustomerData]
  'update:delivery': [value: DeliveryData]
  valid: [value: boolean]
}>()

const customerForm = reactive({
  fullName: props.customer?.fullName ?? '',
  email: props.customer?.email ?? '',
  phone: props.customer?.phone ?? '',
  documentType: props.customer?.documentType ?? 'CC',
  documentNumber: props.customer?.documentNumber ?? '',
})

const deliveryForm = reactive({
  address: props.delivery?.address ?? '',
  city: props.delivery?.city ?? '',
  region: props.delivery?.region ?? '',
  postalCode: props.delivery?.postalCode ?? '',
  phone: props.delivery?.phone ?? '',
})

const isValid = computed(() => {
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerForm.email)
  return (
    customerForm.fullName.trim().length >= 3 &&
    emailOk &&
    deliveryForm.address.trim().length >= 5 &&
    deliveryForm.city.trim().length >= 2
  )
})

watch(
  [customerForm, deliveryForm],
  () => {
    emit('update:customer', {
      fullName: customerForm.fullName.trim(),
      email: customerForm.email.trim().toLowerCase(),
      phone: customerForm.phone.trim() || undefined,
      documentType: customerForm.documentType,
      documentNumber: customerForm.documentNumber.trim() || undefined,
    })
    emit('update:delivery', {
      address: deliveryForm.address.trim(),
      city: deliveryForm.city.trim(),
      region: deliveryForm.region.trim() || undefined,
      postalCode: deliveryForm.postalCode.trim() || undefined,
      phone: deliveryForm.phone.trim() || undefined,
    })
    emit('valid', isValid.value)
  },
  { deep: true },
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div>
      <h4 class="text-sm font-semibold text-slate-800 mb-2">Datos del cliente</h4>
      <div class="flex flex-col gap-3">
        <input
          v-model="customerForm.fullName"
          type="text"
          placeholder="Nombre completo"
          class="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <input
          v-model="customerForm.email"
          type="email"
          placeholder="correo@ejemplo.com"
          class="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <input
          v-model="customerForm.phone"
          type="tel"
          placeholder="Teléfono (opcional)"
          class="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>
    </div>

    <div>
      <h4 class="text-sm font-semibold text-slate-800 mb-2">Datos de entrega</h4>
      <div class="flex flex-col gap-3">
        <input
          v-model="deliveryForm.address"
          type="text"
          placeholder="Dirección"
          class="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <div class="grid grid-cols-2 gap-3">
          <input
            v-model="deliveryForm.city"
            type="text"
            placeholder="Ciudad"
            class="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <input
            v-model="deliveryForm.region"
            type="text"
            placeholder="Departamento"
            class="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>
    </div>
  </div>
</template>
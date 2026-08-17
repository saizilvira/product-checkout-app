<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import {
  detectCardBrand,
  formatCardNumber,
  isValidCardNumber,
  type CardBrand,
} from '@/composables/useCardBrand'
import type { CardData } from '@/types'

const props = defineProps<{
  modelValue?: CardData | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CardData]
  valid: [value: boolean]
}>()

const form = reactive({
  number: props.modelValue?.number ?? '',
  expMonth: props.modelValue?.expMonth ?? '',
  expYear: props.modelValue?.expYear ?? '',
  cvc: props.modelValue?.cvc ?? '',
  cardHolder: props.modelValue?.cardHolder ?? '',
})

const brand = computed<CardBrand>(() => detectCardBrand(form.number))

const isValid = computed(() => {
  return (
    isValidCardNumber(form.number) &&
    /^\d{2}$/.test(form.expMonth) &&
    Number(form.expMonth) >= 1 &&
    Number(form.expMonth) <= 12 &&
    /^\d{2}$/.test(form.expYear) &&
    form.cvc.length >= 3 &&
    form.cardHolder.trim().length >= 3
  )
})

watch(
  form,
  () => {
    emit('update:modelValue', {
      number: form.number.replace(/\s+/g, ''),
      expMonth: form.expMonth,
      expYear: form.expYear,
      cvc: form.cvc,
      cardHolder: form.cardHolder.trim(),
      brand: brand.value,
      lastFour: form.number.replace(/\s+/g, '').slice(-4),
    })
    emit('valid', isValid.value)
  },
  { deep: true },
)

function onNumberInput(e: Event) {
  const target = e.target as HTMLInputElement
  form.number = formatCardNumber(target.value)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div>
      <label class="block text-xs font-medium text-slate-600 mb-1">Número de tarjeta</label>
      <div class="relative">
        <input
          :value="form.number"
          type="text"
          inputmode="numeric"
          autocomplete="cc-number"
          placeholder="4242 4242 4242 4242"
          class="w-full h-11 px-3 pr-16 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          @input="onNumberInput"
        />
        <span
          class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-wide"
          :class="{
            'text-blue-600': brand === 'VISA',
            'text-red-600': brand === 'MASTERCARD',
            'text-slate-300': brand === 'UNKNOWN',
          }"
        >
          {{ brand === 'UNKNOWN' ? '' : brand }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-3">
      <div>
        <label class="block text-xs font-medium text-slate-600 mb-1">Mes</label>
        <input
          v-model="form.expMonth"
          type="text"
          inputmode="numeric"
          maxlength="2"
          placeholder="12"
          class="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-600 mb-1">Año</label>
        <input
          v-model="form.expYear"
          type="text"
          inputmode="numeric"
          maxlength="2"
          placeholder="28"
          class="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-600 mb-1">CVC</label>
        <input
          v-model="form.cvc"
          type="text"
          inputmode="numeric"
          maxlength="4"
          placeholder="123"
          class="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>
    </div>

    <div>
      <label class="block text-xs font-medium text-slate-600 mb-1">Titular</label>
      <input
        v-model="form.cardHolder"
        type="text"
        autocomplete="cc-name"
        placeholder="JUAN PEREZ"
        class="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-slate-900"
      />
    </div>
  </div>
</template>
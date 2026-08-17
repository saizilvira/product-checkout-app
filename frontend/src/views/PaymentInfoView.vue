<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCheckoutStore } from '@/stores/checkout'
import BaseModal from '@/components/ui/BaseModal.vue'
import CreditCardForm from '@/components/CreditCardForm.vue'
import DeliveryForm from '@/components/DeliveryForm.vue'
import type { CardData, CustomerData, DeliveryData } from '@/types'

const router = useRouter()
const checkoutStore = useCheckoutStore()

const showCardModal = ref(false)
const cardValid = ref(false)
const deliveryValid = ref(false)

const card = ref<CardData | null>(checkoutStore.card)
const customer = ref<CustomerData | null>(checkoutStore.customer)
const delivery = ref<DeliveryData | null>(checkoutStore.delivery)

function goBack() {
  checkoutStore.setStep('product')
  router.push({ name: 'product' })
}

function openCardModal() {
  showCardModal.value = true
}

function closeCardModal() {
  showCardModal.value = false
}

function saveCardAndClose() {
  if (!cardValid.value || !card.value) return
  checkoutStore.setCard(card.value)
  showCardModal.value = false
}

function goToSummary() {
  if (!cardValid.value || !deliveryValid.value || !card.value || !customer.value || !delivery.value) {
    return
  }
  checkoutStore.setCard(card.value)
  checkoutStore.setCustomer(customer.value)
  checkoutStore.setDelivery(delivery.value)
  checkoutStore.setStep('summary')
  router.push({ name: 'summary' })
}

const canContinue = ref(false)

function updateCanContinue() {
  canContinue.value =
    cardValid.value &&
    deliveryValid.value &&
    !!card.value &&
    !!customer.value &&
    !!delivery.value
}
</script>

<template>
  <div class="flex flex-col gap-5 pb-8">
    <button type="button" class="text-sm text-slate-500 self-start" @click="goBack">
      ← Volver
    </button>

    <h2 class="text-lg font-semibold text-slate-900">Pago y entrega</h2>

    <!-- Botón que abre el Modal de tarjeta -->
    <button
      type="button"
      class="w-full flex items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 bg-white text-left"
      @click="openCardModal"
    >
      <div>
        <p class="text-sm font-medium text-slate-900">Tarjeta de crédito</p>
        <p class="text-xs text-slate-500 mt-0.5">
          <template v-if="card?.lastFour">
            {{ card.brand }} •••• {{ card.lastFour }}
          </template>
          <template v-else>
            Ingresa los datos de tu tarjeta
          </template>
        </p>
      </div>
      <span class="text-slate-400">›</span>
    </button>

    <!-- Formulario de cliente + entrega -->
    <div class="bg-white rounded-2xl border border-slate-200 p-4">
      <DeliveryForm
        :customer="customer"
        :delivery="delivery"
        @update:customer="(v) => { customer = v; updateCanContinue() }"
        @update:delivery="(v) => { delivery = v; updateCanContinue() }"
        @valid="(v) => { deliveryValid = v; updateCanContinue() }"
      />
    </div>

    <button
      type="button"
      class="w-full h-12 rounded-xl font-semibold text-white transition active:scale-[0.98]"
      :class="canContinue ? 'bg-slate-900' : 'bg-slate-300 cursor-not-allowed'"
      :disabled="!canContinue"
      @click="goToSummary"
    >
      Continuar al resumen
    </button>

    <!-- Modal de tarjeta -->
    <BaseModal :open="showCardModal" title="Datos de la tarjeta" @close="closeCardModal">
      <CreditCardForm
        :model-value="card"
        @update:model-value="(v) => { card = v; updateCanContinue() }"
        @valid="(v) => { cardValid = v; updateCanContinue() }"
      />

      <button
        type="button"
        class="mt-4 w-full h-12 rounded-xl font-semibold text-white"
        :class="cardValid ? 'bg-slate-900' : 'bg-slate-300 cursor-not-allowed'"
        :disabled="!cardValid"
        @click="saveCardAndClose"
      >
        Guardar tarjeta
      </button>

      <p class="mt-3 text-[11px] text-slate-400 text-center">
        Usa tarjetas de prueba: 4242 4242 4242 4242 (aprobada)
      </p>
    </BaseModal>
  </div>
</template>
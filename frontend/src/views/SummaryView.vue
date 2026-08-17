<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCheckoutStore } from '@/stores/checkout'

const router = useRouter()
const checkoutStore = useCheckoutStore()

function goBack() {
  checkoutStore.setStep('payment-info')
  router.push({ name: 'payment-info' })
}

function goToResult() {
  checkoutStore.setStep('result')
  router.push({ name: 'result' })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <button type="button" class="text-sm text-slate-500 self-start" @click="goBack">
      ← Volver
    </button>

    <h2 class="text-lg font-semibold text-slate-900">Resumen de pago</h2>

    <p class="text-sm text-slate-500">
      Aquí irá el Backdrop con producto + base fee + delivery fee.
    </p>

    <button
      type="button"
      class="w-full h-12 rounded-xl font-semibold text-white bg-slate-900"
      @click="goToResult"
    >
      Pagar
    </button>
  </div>
</template>
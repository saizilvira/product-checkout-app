<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCheckoutStore } from '@/stores/checkout'

const router = useRouter()
const checkoutStore = useCheckoutStore()

function goBack() {
  checkoutStore.setStep('product')
  router.push({ name: 'product' })
}

function goToSummary() {
  // Por ahora solo navega; el formulario real lo armamos en el siguiente paso
  checkoutStore.setStep('summary')
  router.push({ name: 'summary' })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <button
      type="button"
      class="text-sm text-slate-500 self-start"
      @click="goBack"
    >
      ← Volver
    </button>

    <h2 class="text-lg font-semibold text-slate-900">
      Datos de pago y entrega
    </h2>

    <p class="text-sm text-slate-500">
      Aquí irá el modal/formulario de tarjeta + datos de entrega.
    </p>

    <button
      type="button"
      class="w-full h-12 rounded-xl font-semibold text-white bg-slate-900"
      @click="goToSummary"
    >
      Continuar al resumen
    </button>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCheckoutStore } from '@/stores/checkout'
import { useProductStore } from '@/stores/product'

const router = useRouter()
const checkoutStore = useCheckoutStore()
const productStore = useProductStore()

async function goToProduct() {
  checkoutStore.reset()
  await productStore.fetchProduct()
  router.push({ name: 'product' })
}
</script>

<template>
  <div class="flex flex-col gap-4 items-center py-8">
    <h2 class="text-lg font-semibold text-slate-900">Resultado del pago</h2>

    <p class="text-sm text-slate-500 text-center">
      Aquí se mostrará el estado final de la transacción.
    </p>

    <button
      type="button"
      class="w-full h-12 rounded-xl font-semibold text-white bg-slate-900"
      @click="goToProduct"
    >
      Volver al producto
    </button>
  </div>
</template>
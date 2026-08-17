<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCheckoutStore } from '@/stores/checkout'
import { useProductStore } from '@/stores/product'

const router = useRouter()
const checkoutStore = useCheckoutStore()
const productStore = useProductStore()

onMounted(() => {
  if (!checkoutStore.transaction) {
    router.replace({ name: 'product' })
  }
})

const status = computed(() => checkoutStore.transaction?.status ?? 'ERROR')

const statusConfig = computed(() => {
  switch (status.value) {
    case 'APPROVED':
      return {
        title: 'Pago aprobado',
        message: 'Tu compra se realizó correctamente. Pronto recibirás el producto.',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        icon: '✓',
      }
    case 'DECLINED':
      return {
        title: 'Pago declinado',
        message: 'La entidad rechazó la transacción. Intenta con otra tarjeta.',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        icon: '!',
      }
    default:
      return {
        title: 'Error en el pago',
        message: 'Ocurrió un problema al procesar el pago. Intenta de nuevo.',
        color: 'text-red-700',
        bg: 'bg-red-50',
        icon: '×',
      }
  }
})

const formatMoney = (cents: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(cents / 100)

async function goToProduct() {
  const wasApproved = status.value === 'APPROVED'
  checkoutStore.reset()
  await productStore.fetchProduct()
  router.push({ name: 'product' })
  // El stock se actualiza en backend solo si fue APPROVED
  if (wasApproved) {
    // fetchProduct ya trae el stock actualizado
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 py-6">
    <div
      class="rounded-2xl p-6 flex flex-col items-center text-center gap-3"
      :class="statusConfig.bg"
    >
      <div
        class="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold bg-white shadow-sm"
        :class="statusConfig.color"
      >
        {{ statusConfig.icon }}
      </div>
      <h2 class="text-xl font-bold" :class="statusConfig.color">
        {{ statusConfig.title }}
      </h2>
      <p class="text-sm text-slate-600 max-w-xs">
        {{ statusConfig.message }}
      </p>
    </div>

    <div
      v-if="checkoutStore.transaction"
      class="bg-white rounded-2xl border border-slate-200 p-4 text-sm flex flex-col gap-2"
    >
      <div class="flex justify-between">
        <span class="text-slate-500">Referencia</span>
        <span class="font-mono text-xs">{{ checkoutStore.transaction.reference }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">Estado</span>
        <span class="font-medium">{{ checkoutStore.transaction.status }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">Total</span>
        <span class="font-semibold">
          {{ formatMoney(checkoutStore.transaction.totalInCents) }}
        </span>
      </div>
    </div>

    <button
      type="button"
      class="w-full h-12 rounded-xl font-semibold text-white bg-slate-900 active:scale-[0.98]"
      @click="goToProduct"
    >
      Volver al producto
    </button>
  </div>
</template>
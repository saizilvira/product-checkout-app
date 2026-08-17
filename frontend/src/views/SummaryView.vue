<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCheckoutStore } from '@/stores/checkout'
import { createTransaction, processPayment } from '@/services/checkout'
import { tokenizeCard } from '@/services/payment'

const router = useRouter()
const productStore = useProductStore()
const checkoutStore = useCheckoutStore()

const loading = ref(false)
const error = ref<string | null>(null)

const formatMoney = (cents: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(cents / 100)

const productAmount = computed(
  () => checkoutStore.transaction?.amountInCents ?? productStore.product?.priceInCents ?? 0,
)
const baseFee = computed(() => checkoutStore.baseFeeInCents)
const deliveryFee = computed(() => checkoutStore.deliveryFeeInCents)
const total = computed(() => productAmount.value + baseFee.value + deliveryFee.value)

onMounted(() => {
  // Si no hay datos de checkout, volver
  if (!checkoutStore.customer || !checkoutStore.delivery || !checkoutStore.card) {
    router.replace({ name: 'payment-info' })
  }
  if (!productStore.product) {
    productStore.fetchProduct()
  }
})

function goBack() {
  checkoutStore.setStep('payment-info')
  router.push({ name: 'payment-info' })
}

async function pay() {
  if (!productStore.product || !checkoutStore.customer || !checkoutStore.delivery || !checkoutStore.card) {
    return
  }

  loading.value = true
  error.value = null

  try {
    // 1. Crear transacción PENDING en el backend
    const transaction = await createTransaction({
      productId: productStore.product.id,
      customer: checkoutStore.customer,
      delivery: checkoutStore.delivery,
      cardBrand: checkoutStore.card.brand,
      cardLastFour: checkoutStore.card.lastFour,
    })
    checkoutStore.setTransaction(transaction)

    // 2. Tokenizar tarjeta
    const paymentSourceId = await tokenizeCard(checkoutStore.card)
    checkoutStore.setPaymentSourceId(paymentSourceId)

    // 3. Procesar pago
    const result = await processPayment({
      transactionId: transaction.id,
      paymentSourceId,
      customerEmail: checkoutStore.customer.email,
    })
    checkoutStore.setTransaction(result)

    // 4. Ir al resultado
    checkoutStore.setStep('result')
    router.push({ name: 'result' })
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error al procesar el pago'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col min-h-[70vh]">
    <button type="button" class="text-sm text-slate-500 self-start mb-3" @click="goBack">
      ← Volver
    </button>

    <!-- BACKDROP (Material-like): capa de contenido + capa de acciones -->
    <div class="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <!-- Capa superior: resumen -->
      <div class="flex-1 p-4 flex flex-col gap-4">
        <h2 class="text-lg font-semibold text-slate-900">Resumen de pago</h2>

        <div v-if="productStore.product" class="flex gap-3 items-center">
          <div class="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
            <img
              v-if="productStore.product.imageUrl"
              :src="productStore.product.imageUrl"
              :alt="productStore.product.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="min-w-0">
            <p class="font-medium text-slate-900 truncate">{{ productStore.product.name }}</p>
            <p class="text-sm text-slate-500">1 unidad</p>
          </div>
        </div>

        <div class="border-t border-slate-100 pt-3 flex flex-col gap-2 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-600">Producto</span>
            <span class="font-medium">{{ formatMoney(productAmount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-600">Base fee</span>
            <span class="font-medium">{{ formatMoney(baseFee) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-600">Delivery fee</span>
            <span class="font-medium">{{ formatMoney(deliveryFee) }}</span>
          </div>
          <div class="flex justify-between text-base font-bold border-t border-slate-100 pt-2 mt-1">
            <span>Total</span>
            <span>{{ formatMoney(total) }}</span>
          </div>
        </div>

        <div v-if="checkoutStore.card" class="text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
          Pago con {{ checkoutStore.card.brand }} •••• {{ checkoutStore.card.lastFour }}
        </div>

        <p v-if="error" class="text-sm text-red-600 bg-red-50 rounded-xl p-3">
          {{ error }}
        </p>
      </div>

      <!-- Capa inferior (Backdrop actions) -->
      <div class="border-t border-slate-200 bg-slate-50 p-4">
        <button
          type="button"
          class="w-full h-12 rounded-xl font-semibold text-white transition active:scale-[0.98] flex items-center justify-center gap-2"
          :class="loading ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800'"
          :disabled="loading"
          @click="pay"
        >
          <span
            v-if="loading"
            class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
          />
          {{ loading ? 'Procesando...' : 'Pagar' }}
        </button>
      </div>
    </div>
  </div>
</template>
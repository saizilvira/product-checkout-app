<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCheckoutStore } from '@/stores/checkout'

const router = useRouter()
const productStore = useProductStore()
const checkoutStore = useCheckoutStore()

onMounted(() => {
  productStore.fetchProduct()
})

function startCheckout() {
  if (!productStore.hasStock) return
  checkoutStore.setStep('payment-info')
  router.push({ name: 'payment-info' })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Loading -->
    <div v-if="productStore.loading" class="flex justify-center py-16">
      <div class="w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
    </div>

    <!-- Error -->
    <div
      v-else-if="productStore.error"
      class="rounded-xl bg-red-50 text-red-700 p-4 text-sm"
    >
      {{ productStore.error }}
    </div>

    <!-- Product -->
    <template v-else-if="productStore.product">
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="aspect-[4/3] bg-slate-100">
          <img
            v-if="productStore.product.imageUrl"
            :src="productStore.product.imageUrl"
            :alt="productStore.product.name"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div class="p-4 flex flex-col gap-3">
          <div class="flex items-start justify-between gap-3">
            <h2 class="text-xl font-bold text-slate-900 leading-tight">
              {{ productStore.product.name }}
            </h2>
            <span
              class="shrink-0 text-xs font-medium px-2 py-1 rounded-full"
              :class="
                productStore.hasStock
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-700'
              "
            >
              {{ productStore.hasStock ? `${productStore.product.stock} disponibles` : 'Agotado' }}
            </span>
          </div>

          <p class="text-sm text-slate-600 leading-relaxed">
            {{ productStore.product.description }}
          </p>

          <p class="text-2xl font-bold text-slate-900">
            {{ productStore.priceFormatted }}
          </p>
        </div>
      </div>

      <button
        type="button"
        class="w-full h-12 rounded-xl font-semibold text-white transition active:scale-[0.98]"
        :class="
          productStore.hasStock
            ? 'bg-slate-900 hover:bg-slate-800'
            : 'bg-slate-300 cursor-not-allowed'
        "
        :disabled="!productStore.hasStock"
        @click="startCheckout"
      >
        Pay with credit card
      </button>
    </template>
  </div>
</template>
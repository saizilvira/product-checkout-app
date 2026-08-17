import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types'
import { api } from '@/services/api'

export const useProductStore = defineStore('product', () => {
    const product = ref<Product | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const hasStock = computed(() => (product.value?.stock ?? 0) > 0)
    const priceFormatted = computed(() => {
        if (!product.value) return ''
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(product.value.priceInCents / 100)
    })

    async function fetchProduct() {
        loading.value = true
        error.value = null
        try {
            const { data } = await api.get<Product>('/products')
            product.value = data
        } catch (e: unknown) {
            error.value = e instanceof Error ? e.message : 'Error al cargar el producto'
            product.value = null
        } finally {
            loading.value = false
        }
    }

    function setProduct(p: Product) {
        product.value = p
    }

    return {
        product,
        loading,
        error,
        hasStock,
        priceFormatted,
        fetchProduct,
        setProduct,
    }
})
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'product',
      component: () => import('@/views/ProductView.vue'),
    },
    {
      path: '/checkout/payment',
      name: 'payment-info',
      component: () => import('@/views/PaymentInfoView.vue'),
    },
    {
      path: '/checkout/summary',
      name: 'summary',
      component: () => import('@/views/SummaryView.vue'),
    },
    {
      path: '/checkout/result',
      name: 'result',
      component: () => import('@/views/ResultView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
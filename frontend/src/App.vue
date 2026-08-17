<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-full flex flex-col bg-slate-50">
    <header class="sticky top-0 z-40 bg-white border-b border-slate-200 safe-top">
      <div class="max-w-lg mx-auto px-4 h-14 flex items-center">
        <h1 class="text-lg font-semibold text-slate-900 tracking-tight">
          Store Checkout
        </h1>
      </div>
    </header>

    <main class="flex-1 w-full max-w-lg mx-auto px-4 py-4">
      <RouterView />
    </main>
  </div>
</template>
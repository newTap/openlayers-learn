import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useNumberStore = defineStore('number', {
  state: () => ({
    number: 0,
    name: null as string | null
  }),
  getters: {
    doubleNumber: (state) => state.number * 2
  },
  actions: {
    seName(value: string) {
      this.name = value
    },
    setKey(key: string, value: string) {
      this[key] = value
    }
  }
})

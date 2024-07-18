<script lang="ts">
import { ref } from 'vue'
const num = ref(0)

function useAction(number?: number) {
  const count = ref()

  function countDown() {
    count.value -= 1
    if (count.value > 0) {
      setTimeout(() => {
        countDown()
        console.log('count down', count.value)
      }, 1000)
    }
  }

  count.value = number || 60

  countDown()
  num.value++
  return { count, num }
}

export default useAction
</script>

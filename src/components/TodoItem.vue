<template>
  <li>
    {{ todo.text }} - {{ count }} - {{ num }}
    <button type="button" v-if="todo.state === active" @click="props.changeState(todo.id)">
      done
    </button>
    <button type="button" @click="props.del(todo.id)">del</button>
  </li>
</template>

<script lang="ts" setup>
import type { Todo } from '../types'
import { active } from '../common'
import useCountDown from '@/hooks/useCountDown.vue'

interface Props {
  del: (id: string) => void
  changeState: (id: string) => void
  todo: Todo
}
const props = defineProps<Props>()
const { count, num } = useCountDown(props.todo.text.length * 10)
</script>

<style lang="scss" scoped></style>

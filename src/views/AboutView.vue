<template>
  <div class="about">
    <div>
      <div>
        <input type="text" v-model="text" />
        <button type="button" @click="add">add-{{ count }} - {{ num }}</button>
      </div>
      <div>
        <button type="button" @click="status = 'all'">all</button>
        <button type="button" @click="status = active">active</button>
        <button type="button" @click="status = completed">completed</button>
      </div>
    </div>
    <div>
      <ul>
        <TodoItem
          v-for="todo in showTodos"
          :key="todo.id"
          :todo="todo"
          :changeState="changeState"
          :del="del"
        />
      </ul>
    </div>
  </div>
</template>

<script lang="ts"></script>

<script setup lang="ts">
import type { Todo } from '@/types'
import { ref, reactive, computed } from 'vue'
import TodoItem from '../components/TodoItem.vue'
import { completed, active } from '@/common'
import useCountDown from '@/hooks/useCountDown.vue'

const text = ref('')
const todos: Todo[] = reactive([])
const status = ref<string>('all')
const showTodos = computed(() => {
  if (status.value === 'all') {
    return todos
  }
  return todos.filter((todo) => todo.state === status.value)
})

const { count, num } = useCountDown(100)

function add() {
  todos.push({ text: text.value, id: crypto.randomUUID(), state: active })
  text.value = ''
}

function changeState(id: string) {
  const todo = todos.find((todo) => todo.id === id)
  if (!todo) return false
  todo?.state === active ? (todo.state = completed) : (todo.state = active)
}

function del(id: string) {
  const index = todos.findIndex((todo) => todo.id === id)
  todos.splice(index, 1)
}
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
../common

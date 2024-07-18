import type { active, completed } from '@/common'

export interface Todo {
  text: string
  id: string
  state: typeof active | typeof completed
}

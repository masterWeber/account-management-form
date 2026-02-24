import type {RemovableRef} from '@vueuse/core'

interface AccountStore {
}

export const useTourStore = defineStore('tour', {
  state: (): AccountStore => {
    return {
    }
  },
  actions: {}
})

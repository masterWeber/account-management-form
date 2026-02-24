import type { RemovableRef } from '@vueuse/core'
import type { Account } from '~/types/Account'

interface AccountStore {
  accounts: RemovableRef<Account[]>,
}

export const useAccountStore = defineStore('account', {
  state: (): AccountStore => {
    return {
      accounts: useLocalStorage<Account[]>('accounts', []),
    }
  },
  actions: {
    updateAccount(index: number, account: Account): void {
      this.accounts[index] = {...account}
    },

    deleteAccount(index: number): void {
      this.accounts.splice(index, 1)
    },
  },
})

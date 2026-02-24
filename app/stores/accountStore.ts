import type { RemovableRef } from '@vueuse/core'
import type { Account } from '~/types/Account'
import { AccountType } from '~/types/AccountType'

interface AccountStore {
  accounts: RemovableRef<Account[]>,
}

const DEFAULT_ACCOUNT_TYPE = AccountType.LOCAL

export const useAccountStore = defineStore('account', {
  state: (): AccountStore => {
    return {
      accounts: useLocalStorage<Account[]>('accounts', []),
    }
  },
  actions: {
    addEmptyAccount(): void {
      this.accounts.push({tags: [], type: DEFAULT_ACCOUNT_TYPE, login: '', password: ''})
    },

    deleteAccount(index: number): void {
      this.accounts.splice(index, 1)
    },
  },
})

import type { Account } from '~/types/Account'

export type AccountRow = Omit<Account, 'tags'> & {
  tagsString: string
  touched?: Record<string, boolean>
}

export interface AccountFormState {
  rows: AccountRow[]
}

import type { AccountType } from '~/types/AccountType'
import type { Tag } from '~/types/Tag'

export interface Account {
  tags: Tag[]
  type: AccountType
  login: string
  password: string | null
}

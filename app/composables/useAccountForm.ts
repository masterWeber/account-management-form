import type { AccountFormState } from '~/types/Form'
import type { Account } from '~/types/Account'
import { AccountType } from '~/types/AccountType'
import { accountSchema } from '~/utils/validation'
import { stringToTags, tagsToString } from '~/utils/account-formatter'

export function useAccountForm() {
  const accountStore = useAccountStore()
  const { accounts } = storeToRefs(accountStore)
  const form = ref()

  const DEFAULT_ACCOUNT_TYPE = AccountType.LOCAL
  const accountTypes = Object.values(AccountType)

  const formState = reactive<AccountFormState>({
    rows: accounts.value.map((a: Account) => ({
      ...a,
      tagsString: tagsToString(a.tags),
      touched: {},
    })),
  })

  const isFormValid = computed(() => {
    return accountSchema.safeParse(JSON.parse(JSON.stringify(formState))).success
  })

  async function handleAddAccount() {
    const newAccount: Account = {
      type: DEFAULT_ACCOUNT_TYPE,
      login: '',
      password: '',
      tags: [],
    }

    formState.rows.push({
      ...newAccount,
      tagsString: '',
      touched: {},
    })

    accountStore.addAccount(newAccount)
  }

  function handleDeleteAccount(index: number) {
    formState.rows.splice(index, 1)
    accountStore.deleteAccount(index)
  }

  async function handleBlur(index: number, field?: string) {
    try {
      const row = formState.rows[index]
      if (!row) return

      if (field) {
        if (!row.touched) row.touched = {}
        row.touched[field] = true
      }

      const updatedAccount: Account = {
        type: row.type,
        login: row.login,
        password: row.type === AccountType.LOCAL ? (row.password || '') : null,
        tags: stringToTags(row.tagsString),
      }

      accountStore.updateAccount(index, updatedAccount)

      await form.value.validate({ name: `rows.${index}`, silent: false })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) { /* empty */ }
  }

  return {
    form,
    formState,
    accountTypes,
    isFormValid,
    handleAddAccount,
    handleDeleteAccount,
    handleBlur,
  }
}

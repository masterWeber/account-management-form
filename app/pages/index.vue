<template>
  <div class="page">
    <header class="flex justify-start items-center">
      <h1 class="m-0 text-3xl font-medium p-4">
        Учетные записи
      </h1>
      <UButton
        icon="i-lucide-plus"
        variant="outline"
        :disabled="!isFormValid"
        @click="handleAddAccount"
      />
    </header>
    <UBanner
      color="info"
      icon="i-lucide-info"
      title="Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;"
    />

    <UForm
      ref="form"
      :state="formState"
      :schema="schema"
      :validate-on="['blur', 'change']"
    >
      <UTable
        v-model:data="formState.rows"
        :columns="columns"
        sticky
        empty="Тут пока пусто"
      >
        <template #tagsString-cell="{ row }">
          <UFormField
            :name="`rows.${row.index}.tagsString`"
            class="w-full"
            :error="false"
          >
            <UInput
              v-model="row.original.tagsString"
              maxlength="50"
              placeholder="Метки через ;"
              class="w-full"
              @blur="handleBlur(row.index, 'tagsString')"
            />
          </UFormField>
        </template>
        <template #type-cell="{ row }">
          <UFormField
            :name="`rows.${row.index}.type`"
            class="w-full"
          >
            <USelect
              v-model="row.original.type"
              :items="accountTypes"
              class="w-full"
              @update:model-value="handleBlur(row.index, 'type')"
            />
          </UFormField>
        </template>
        <template #login-cell="{ row }">
          <UFormField
            :name="`rows.${row.index}.login`"
            class="w-full"
            :error="false"
          >
            <UInput
              v-model="row.original.login"
              maxlength="100"
              class="w-full"
              placeholder="Логин"
              @blur="handleBlur(row.index, 'login')"
            />
          </UFormField>
        </template>
        <template #password-cell="{ row }">
          <UFormField
            v-if="row.original.type === AccountType.LOCAL"
            :name="`rows.${row.index}.password`"
            class="w-full"
            :error="false"
          >
            <UInput
              v-model="row.original.password"
              type="password"
              maxlength="100"
              class="w-full"
              placeholder="Пароль"
              @blur="handleBlur(row.index, 'password')"
            />
          </UFormField>
        </template>
        <template #actions-cell="{ row }">
          <UButton
            icon="i-lucide-trash-2"
            variant="ghost"
            color="neutral"
            @click="handleDeleteAccount(row.index)"
          />
        </template>
      </UTable>
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import { z } from 'zod'
import type { TableColumn } from '@nuxt/ui/components/Table.vue'
import type { Account } from '~/types/Account'
import { AccountType } from '~/types/AccountType'
import type { Tag } from '~/types/Tag'

const DEFAULT_ACCOUNT_TYPE = AccountType.LOCAL

const accountStore = useAccountStore()
const accountTypes = Object.values(AccountType)

const form = ref()

const schema = z.object({
  rows: z.array(
    z.object({
      type: z.enum(AccountType),
      login: z.string().trim().min(1).max(100),
      password: z.string().trim().max(100).nullable(),
      tagsString: z.string().max(50).optional(),
    }).refine((data) => {
      if (data.type === AccountType.LOCAL) {
        return !!data.password && data.password.trim() !== ''
      }
      return true
    }, {
      path: ['password'],
    }),
  ),
})

const { accounts } = storeToRefs(accountStore)

type Row = Omit<Account, 'tags'> & { tagsString: string, touched?: Record<string, boolean> }

interface FormState {
  rows: Row[]
}

const formState = reactive<FormState>({
  rows: accounts.value.map((a: Account) => ({
    ...a,
    tagsString: a.tags.map((t: Tag) => t.text).join('; '),
    touched: {},
  })),
})

const columns: TableColumn<Row>[] = [
  {
    accessorKey: 'tagsString',
    header: 'Метки',
    meta: {
      class: {
        th: 'w-64',
      },
    },
  },
  {
    accessorKey: 'type',
    header: 'Тип записи',
    meta: {
      class: {
        th: 'w-48',
      },
    },
  },
  {
    accessorKey: 'login',
    header: 'Логин',
    meta: {
      class: { th: 'w-64' },
      colspan: { td: cell => cell.row.original.type === AccountType.LDAP ? '2' : '1' },
    },
  },
  {
    accessorKey: 'password',
    header: 'Пароль',
    meta: {
      class: {
        th: 'w-64',
        td: cell => cell.row.original.type === AccountType.LDAP ? 'hidden' : '',
      },
    },
  },
  {
    id: 'actions', enableHiding: false, meta: {
      class: {
        td: 'text-right',
        th: 'w-[32px]',
      },
    },
  },
]

const isFormValid = computed(() => {
  return schema.safeParse(JSON.parse(JSON.stringify(formState))).success
})

async function handleAddAccount() {
  try {
    await form.value.validate()
    formState.rows.push({
      tagsString: '',
      type: DEFAULT_ACCOUNT_TYPE,
      login: '',
      password: '',
      touched: {},
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) { /* empty */ }
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

    const isTouched = row.touched?.login || row.touched?.password

    if (!isTouched) {
      return
    }

    await form.value.validate({ name: `rows.${index}`, silent: false })

    const updatedAccount: Account = {
      type: row.type,
      login: row.login,
      password: row.type === AccountType.LOCAL ? (row.password || '') : null,
      tags: row.tagsString
        ? row.tagsString.split(';').filter(t => t.trim() !== '').map(t => ({ text: t.trim() }))
        : [],
    }

    accountStore.updateAccount(index, updatedAccount)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) { /* empty */ }
}
</script>

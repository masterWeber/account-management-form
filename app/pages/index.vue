<template>
  <div class="page">
    <header class="flex justify-start items-center">
      <h1 class="m-0 text-3xl font-medium p-4">Учетные записи</h1>
      <UButton
        icon="i-lucide-plus"
        @click="handleAddAccount"
      />
    </header>
    <UTable
      :data="data"
      :columns="columns"
      sticky
      empty="Тут пока пусто"
    >
      <template #tags-cell="{ row }">
        {{ row.original.tags.join(';') }}
      </template>
      <template #type-cell="{ row }">
        {{ row.original.type }}
      </template>
      <template #login-cell="{ row }">
        {{ row.original.login }}
      </template>
      <template #password-cell="{ row }">
        {{ row.original.password }}
      </template>
      <template #actions-cell="{ row }">
        <UButton
          icon="i-lucide-trash-2"
          @click="handleDeleteAccount(row.index)"
        />
      </template>
    </UTable>
  </div>
</template>

<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui/components/Table.vue'
import type { Account } from '~/types/Account'

const accountStore = useAccountStore()

const columns: TableColumn<Account>[] = [
  {
    accessorKey: 'tags',
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
      class: {
        th: 'w-64',
      },
    },
  },
  {
    accessorKey: 'password',
    header: 'Пароль',
    meta: {
      class: {
        th: 'w-64',
      },
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    meta: {
      class: {
        td: 'text-right',
        th: 'w-24',
      },
    },
  },
]

function handleAddAccount(): void {
  accountStore.addEmptyAccount()
}

function handleDeleteAccount(index: number): void {
  accountStore.deleteAccount(index)
}

const {accounts: data} = storeToRefs(accountStore)
</script>

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
      :schema="accountSchema"
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
import type { TableColumn } from '@nuxt/ui/components/Table.vue'
import type { AccountRow } from '~/types/Form'
import { AccountType } from '~/types/AccountType'

const {
  form,
  formState,
  accountTypes,
  isFormValid,
  handleAddAccount,
  handleDeleteAccount,
  handleBlur,
} = useAccountForm()

const columns: TableColumn<AccountRow>[] = [
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
</script>

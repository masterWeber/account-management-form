import { z } from 'zod'
import { AccountType } from '~/types/AccountType'

export const accountSchema = z.object({
  rows: z.array(
    z.object({
      type: z.nativeEnum(AccountType),
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

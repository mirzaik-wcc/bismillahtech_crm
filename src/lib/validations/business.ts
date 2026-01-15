import { z } from "zod"

export const createBusinessSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    timezone: z.string().default("UTC"),
    crm_mode: z.enum(["internal_only", "hybrid", "external_only"]),
})

export type CreateBusinessSchema = z.infer<typeof createBusinessSchema>

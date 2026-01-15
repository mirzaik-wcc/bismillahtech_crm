"use server"

import { createClient } from "@/lib/supabase/server"
import { createBusinessSchema } from "@/lib/validations/business"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createBusiness(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Unauthorized" }
    }

    // Get user's organization
    const { data: profile } = await supabase
        .from("user_profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single()

    if (!profile?.organization_id) {
        return { error: "Organization not found" }
    }

    const validatedFields = createBusinessSchema.safeParse({
        name: formData.get("name"),
        timezone: formData.get("timezone"),
        crm_mode: formData.get("crm_mode"),
    })

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors }
    }

    const { error } = await supabase.from("businesses").insert({
        organization_id: profile.organization_id,
        name: validatedFields.data.name,
        timezone: validatedFields.data.timezone,
        crm_mode: validatedFields.data.crm_mode,
        status: "onboarding",
    })

    if (error) {
        return { error: "Failed to create business: " + error.message }
    }

    revalidatePath("/dashboard/businesses")
    redirect("/dashboard/businesses")
}

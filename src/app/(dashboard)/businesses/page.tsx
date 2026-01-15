import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Plus } from "lucide-react"
import { redirect } from "next/navigation"

export default async function BusinessesPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    // Get user's organization
    const { data: profile } = await supabase
        .from("user_profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single()

    if (!profile?.organization_id) {
        return <div>Organization not found. Please contact support.</div>
    }

    const { data: businesses } = await supabase
        .from("businesses")
        .select("*")
        .eq("organization_id", profile.organization_id)
        .order("created_at", { ascending: false })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Businesses</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your client portfolio.
                    </p>
                </div>
                <Link
                    href="/dashboard/businesses/new"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Business
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {businesses?.map((business) => (
                    <Link
                        key={business.id}
                        href={`/dashboard/businesses/${business.id}`}
                        className="block group"
                    >
                        <div className="border rounded-xl p-6 bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                                    {business.name}
                                </h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${business.status === 'active' ? 'bg-green-100 text-green-700' :
                                        business.status === 'onboarding' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                    }`}>
                                    {business.status}
                                </span>
                            </div>
                            <div className="mt-4 text-sm text-muted-foreground">
                                <p>Mode: <span className="font-medium text-foreground capitalize">{business.crm_mode.replace('_', ' ')}</span></p>
                                <p>Timezone: {business.timezone}</p>
                            </div>
                        </div>
                    </Link>
                ))}
                {businesses?.length === 0 && (
                    <div className="col-span-full text-center py-12 border rounded-xl border-dashed">
                        <h3 className="text-lg font-medium">No businesses yet</h3>
                        <p className="text-muted-foreground mt-1 mb-4">Onboard your first client to get started.</p>
                        <Link
                            href="/dashboard/businesses/new"
                            className="text-primary hover:underline"
                        >
                            Create Business
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

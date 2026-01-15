import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Building2, PhoneCall, Plus } from "lucide-react"

export default async function DashboardOverview() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Fetch Businesses count
    const { count: businessCount, error: businessError } = await supabase
        .from("businesses")
        .select("*", { count: "exact", head: true })

    // Fetch Leaks count (using head for performance)
    const { count: leakCount, error: leakError } = await supabase
        .from("leaks")
        .select("*", { count: "exact", head: true })

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                <p className="text-muted-foreground">
                    Welcome back, {user.email}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Stats Card 1 */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Businesses</h3>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{businessCount || 0}</div>
                    <p className="text-xs text-muted-foreground">Active clients</p>
                </div>

                {/* Stats Card 2 */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Revenue Leaks</h3>
                        <PhoneCall className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{leakCount || 0}</div>
                    <p className="text-xs text-muted-foreground">Detected incidents</p>
                </div>
            </div>

            {/* Quick Actions / Empty State */}
            <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="flex gap-4">
                        <Link
                            href="/dashboard/businesses/new"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Business
                        </Link>
                        <Link
                            href="/dashboard/businesses"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                        >
                            View All Businesses
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

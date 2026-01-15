import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { DeployAgentButton } from "./_components/deploy-agent-button"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function BusinessDashboardPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const { data: business } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", id)
        .single()

    if (!business) {
        notFound()
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <Link href="/dashboard/businesses" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Businesses
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{business.name}</h1>
                        <p className="text-muted-foreground mt-1 flex items-center gap-2">
                            <span className="capitalize">{business.crm_mode.replace('_', ' ')} Mode</span>
                            <span>•</span>
                            <span>{business.timezone}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-muted">
                            Settings
                        </button>
                        <DeployAgentButton businessId={business.id} />
                    </div>
                </div>
            </div>

            {/* Widgets Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Leaks Widget Placeholder */}
                <div className="border rounded-xl p-6 bg-card text-card-foreground shadow-sm">
                    <h3 className="font-semibold mb-4">Revenue Leaks</h3>
                    <div className="flex items-center justify-center h-32 bg-muted/20 rounded-lg border border-dashed">
                        <p className="text-sm text-muted-foreground">No leaks detected yet.</p>
                    </div>
                </div>

                {/* Activity Widget Placeholder */}
                <div className="border rounded-xl p-6 bg-card text-card-foreground shadow-sm md:col-span-2">
                    <h3 className="font-semibold mb-4">Recent Activity</h3>
                    <div className="flex items-center justify-center h-32 bg-muted/20 rounded-lg border border-dashed">
                        <p className="text-sm text-muted-foreground">No recent activity.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

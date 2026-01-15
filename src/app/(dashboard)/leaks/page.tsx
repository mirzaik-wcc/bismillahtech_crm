import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AlertCircle, CheckCircle, PhoneOff } from "lucide-react"

export default async function LeaksPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Fetch all leaks for the user's organization
    const { data: leaks } = await supabase
        .from("leaks")
        .select(`
      *,
      business:businesses(name)
    `)
        .order("detected_at", { ascending: false })

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Revenue Leaks</h2>
                <p className="text-muted-foreground">
                    All detected incidents across your businesses.
                </p>
            </div>

            <div className="rounded-md border">
                <div className="p-4">
                    {leaks && leaks.length > 0 ? (
                        <div className="space-y-4">
                            {leaks.map((leak) => (
                                <div key={leak.id} className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 dark:bg-red-900/20">
                                            <PhoneOff size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{leak.business?.name || "Unknown Business"}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {leak.type === 'missed_call' ? 'Missed Call' : leak.type} • {new Date(leak.detected_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80">
                                            {leak.status}
                                        </span>
                                        <p className="text-sm font-medium mt-1">
                                            {leak.potential_value ? `$${leak.potential_value}` : '$-'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                            <h3 className="text-lg font-medium">No Leaks Detected</h3>
                            <p className="text-muted-foreground">Good job! Your businesses are operating efficiently.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

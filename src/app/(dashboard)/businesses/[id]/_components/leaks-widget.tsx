import { createClient } from "@/lib/supabase/server"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"

export async function LeaksWidget({ businessId }: { businessId: string }) {
    const supabase = await createClient()

    const { data: leaks } = await supabase
        .from("leaks")
        .select("*")
        .eq("business_id", businessId)
        .order("detected_at", { ascending: false })
        .limit(5)

    if (!leaks || leaks.length === 0) {
        return (
            <div className="border rounded-xl p-6 bg-card text-card-foreground shadow-sm">
                <h3 className="font-semibold mb-4">Revenue Leaks</h3>
                <div className="flex flex-col items-center justify-center h-48 bg-muted/20 rounded-lg border border-dashed text-center p-4">
                    <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                    <p className="font-medium">No leaks detected</p>
                    <p className="text-xs text-muted-foreground">Great job! Capture rate is 100%.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="border rounded-xl p-6 bg-card text-card-foreground shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Revenue Leaks</h3>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                    {leaks.length} Needs Attention
                </span>
            </div>

            <div className="space-y-3">
                {leaks.map((leak) => (
                    <div key={leak.id} className="flex items-start gap-3 p-3 rounded-lg border bg-background/50">
                        <div className="mt-1">
                            {leak.type === 'missed_call' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium capitalize">{leak.type.replace('_', ' ')}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(leak.detected_at).toLocaleString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-destructive">
                                ${leak.potential_value || 0}
                            </span>
                            <button className="block text-xs text-primary hover:underline mt-1">
                                Resolve
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

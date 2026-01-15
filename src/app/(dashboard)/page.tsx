export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                <p className="text-muted-foreground">Welcome to the Consulting Operating System.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
                    <h3 className="font-semibold text-sm text-muted-foreground">Active Businesses</h3>
                    <div className="text-2xl font-bold mt-2">0</div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
                    <h3 className="font-semibold text-sm text-muted-foreground">Detected Leaks</h3>
                    <div className="text-2xl font-bold mt-2">$0.00</div>
                </div>
            </div>
        </div>
    )
}

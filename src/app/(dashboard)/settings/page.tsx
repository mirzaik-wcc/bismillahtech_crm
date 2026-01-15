import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { User } from "lucide-react"

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Fetch Profile
    const { data: profile } = await supabase
        .from("user_profiles")
        .select("*, organization:organizations(name)")
        .eq("id", user.id)
        .single()

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account and preferences.
                </p>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-lg font-semibold leading-none tracking-tight">Profile</h3>
                    <p className="text-sm text-muted-foreground">Your personal information.</p>
                </div>
                <div className="p-6 pt-0 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                            <User size={32} className="text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-medium">{profile?.full_name || "Consultant"}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Organization</label>
                        <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                            {profile?.organization?.name || "Loading..."}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Role</label>
                        <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground capitalize">
                            {profile?.role || "User"}
                        </div>
                    </div>
                </div>
                <div className="flex items-center p-6 pt-0">
                    <p className="text-xs text-muted-foreground">
                        To update these details, please contact system administrator (MVP limitation).
                    </p>
                </div>
            </div>
        </div>
    )
}

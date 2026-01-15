import Link from "next/link"
import { LayoutDashboard, Users, FileText, Settings, LogOut } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen w-full bg-background">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-card hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
                        <span className="text-primary">Bismillah</span>Tech
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" />
                    <NavItem href="/dashboard/businesses" icon={<Users size={20} />} label="Businesses" />
                    <NavItem href="/dashboard/leaks" icon={<FileText size={20} />} label="Revenue Leaks" />
                </nav>
                <div className="p-4 border-t space-y-2">
                    <NavItem href="/dashboard/settings" icon={<Settings size={20} />} label="Settings" />
                    <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 border-b flex items-center px-6 justify-between bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                    <h1 className="text-lg font-semibold">Consulting OS</h1>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            MK
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
        >
            {icon}
            <span>{label}</span>
        </Link>
    )
}

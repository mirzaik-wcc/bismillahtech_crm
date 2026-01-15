import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 h-16 flex items-center justify-between border-b">
        <div className="font-bold text-xl">
          <span className="text-primary">Bismillah</span>Tech
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:underline">
            Login
          </Link>
          <Link
            href="/login" // For MVP, Get Started also goes to Login
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-black">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl mb-6">
          The Consulting Operating System
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-8">
          Manage clients, detect revenue leaks, and deploy specialized Voice AI agents.
          The system of record for consulting truth.
        </p>
        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 text-lg font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all"
          >
            Go to Dashboard <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        <p>© 2026 BismillahTech Consulting.</p>
      </footer>
    </div>
  )
}

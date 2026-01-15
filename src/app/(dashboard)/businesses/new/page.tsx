import { NewBusinessForm } from "./new-business-form"

export default function NewBusinessPage() {
    return (
        <div className="max-w-2xl mx-auto py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Onboard New Business</h1>
                <p className="text-muted-foreground mt-2">
                    Add a client to the Consulting OS. Select the appropriate CRM Mode to determine our engagement level.
                </p>
            </div>
            <div className="bg-card border rounded-lg p-6">
                <NewBusinessForm />
            </div>
        </div>
    )
}

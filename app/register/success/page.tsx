import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function RegisterSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-onyx px-4">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="seal-badge h-16 w-16">
          <CheckCircle2 className="h-7 w-7 text-gold" strokeWidth={1.5} />
        </div>
        <h1 className="font-display text-2xl text-gold">BioData Submitted</h1>
        <p className="text-sm text-parchment-muted">
          Your registration is now pending review by your chapter officers. You'll receive an
          email once it's approved and your membership number is issued.
        </p>
        <Link href="/login" className={buttonVariants({ variant: "outline" })}>
          Return to Login
        </Link>
      </div>
    </main>
  );
}

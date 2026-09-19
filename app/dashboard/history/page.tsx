export const dynamic = "force-dynamic";

import { constitutionText } from "./constitution-data";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-gold">Fraternity & Sorority Constitution</h1>
        <p className="text-sm text-parchment-muted">
          The Revised CONSTITUTION of the Zeta Psi Omicron Fraternity and Psi Zeta Omicr0n Sorority.
        </p>
      </div>
      
      <div className="card-surface p-6 overflow-hidden">
        <div className="prose prose-invert prose-gold max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-sm text-parchment-muted bg-transparent p-0 overflow-x-hidden">
            {constitutionText.trim()}
          </pre>
        </div>
      </div>
    </div>
  );
}


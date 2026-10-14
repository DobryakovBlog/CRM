import type { LegalDoc } from "@/lib/legal";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <h1 className="font-display text-4xl">{doc.title}</h1>
        <p className="text-sm text-muted">{doc.updated}</p>
        <p className="leading-relaxed">{doc.intro}</p>
      </header>
      {doc.sections.map((section) => (
        <section key={section.title} className="space-y-3">
          <h2 className="font-display text-2xl">{section.title}</h2>
          {section.body.map((block, i) =>
            Array.isArray(block) ? (
              <ul key={i} className="list-disc space-y-1 pl-5 leading-relaxed">
                {block.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p key={i} className="leading-relaxed">
                {block}
              </p>
            ),
          )}
        </section>
      ))}
    </article>
  );
}

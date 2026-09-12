import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, CalendarCheck, Gauge, Languages, ScanLine, ShieldCheck } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";

const agents = [
  {
    icon: ScanLine,
    step: "01",
    title: "Extraction agent",
    what: "Reads the photo of your lab report.",
    detail: "It finds every test name, its value, the unit and the normal reference range, then flags each result as normal, high or low.",
  },
  {
    icon: Brain,
    step: "02",
    title: "Interpretation agent",
    what: "Turns numbers into plain language.",
    detail: "Each flagged value is explained twice — once in simple English and once in Urdu — along with a practical next step you can actually follow.",
  },
  {
    icon: Gauge,
    step: "03",
    title: "Urgency agent",
    what: "Decides how soon you should act.",
    detail: "Results are rated Routine, Needs Attention or Urgent, with a short reason so you know why that rating was given.",
  },
  {
    icon: CalendarCheck,
    step: "04",
    title: "Scheduling agent",
    what: "Suggests the right doctor.",
    detail: "Based on the urgency and the specialty involved, it picks a realistic slot at a government or private hospital and explains the choice.",
  },
];

const faqs = [
  ["Is this a diagnosis?", "No. Sehat Sahulat explains what your report says and how urgent it looks. A qualified doctor confirms and treats."],
  ["What images work best?", "A bright, flat photo where every test name and number is readable. JPEG, PNG or WEBP, under 12 MB."],
  ["Does it understand Urdu?", "Every explanation is produced in both English and Urdu, and the AI mentor replies in whichever you use."],
  ["What happens to my report?", "It is processed for the analysis and is not shared with anyone else."],
];

export const Route = createFileRoute("/how-it-works")({
  head: () => ({ meta: [
    { title: "How It Works | Sehat Sahulat" },
    { name: "description", content: "See the four AI agents that read your lab report, explain it in English and Urdu, rate urgency and suggest an appointment." },
    { property: "og:title", content: "How Sehat Sahulat Works" },
    { property: "og:description", content: "Four AI agents turn a lab report photo into clear guidance." },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: HowItWorks,
});

function HowItWorks() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-card py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-5">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Behind the scenes</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-6xl">
              Four AI agents, one clear answer.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              One photo goes in. It passes through four specialised agents, each doing a single job well, and comes back as an explanation you can act on.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-5">
            <ol className="relative space-y-6 border-l border-border pl-6 sm:pl-10">
              {agents.map((agent) => (
                <li key={agent.step} className="relative rounded-2xl border border-border bg-card p-6 sm:p-8">
                  <span className="absolute -left-[2.1rem] top-8 hidden size-4 rounded-full border-4 border-background bg-primary sm:block" />
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary"><agent.icon className="size-6" /></span>
                    <div>
                      <p className="font-display text-xs text-muted-foreground">Step {agent.step}</p>
                      <h2 className="font-display text-xl font-semibold">{agent.title}</h2>
                    </div>
                  </div>
                  <p className="mt-5 font-semibold">{agent.what}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{agent.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-y border-border bg-card py-16">
          <div className="mx-auto grid max-w-5xl gap-6 px-5 sm:grid-cols-3">
            {[
              [Languages, "Bilingual by default", "Every explanation arrives in English and Urdu together."],
              [ShieldCheck, "Private by design", "Your report is used for the analysis and nothing else."],
              [Brain, "A mentor on call", "Follow-up questions go to the AI mentor, any time."],
            ].map(([Icon, title, body]) => {
              const Component = Icon as typeof Brain;
              return (
                <div key={title as string} className="rounded-2xl border border-border p-6">
                  <Component className="size-6 text-primary" />
                  <h3 className="mt-4 font-display text-lg font-semibold">{title as string}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{body as string}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="font-display text-3xl font-semibold">Common questions</h2>
            <div className="mt-8 divide-y divide-border">
              {faqs.map(([question, answer]) => (
                <details key={question} className="group py-5">
                  <summary className="cursor-pointer list-none font-semibold marker:hidden">{question}</summary>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{answer}</p>
                </details>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" asChild><Link to="/" hash="upload">Analyze my report <ArrowRight className="size-4" /></Link></Button>
              <Button size="lg" variant="secondary" asChild><Link to="/mentor">Ask the AI mentor</Link></Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight, CalendarDays, Check, CheckCircle2, ChevronDown, CircleAlert,
  Clock3, FileImage, HeartPulse, Languages, MapPin, Phone, RotateCcw,
  ShieldCheck, Stethoscope, UploadCloud, UserRound, X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type DragEvent, type FormEvent } from "react";

import heroImage from "@/assets/sehat-clinic-hero.jpg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Flag = "normal" | "high" | "low" | "unknown";
type ReportResult = {
  extraction: { values: Array<{ test_name: string; value: string; unit: string; reference_range: string; flag: Flag }>; raw_notes: string | null };
  interpretation: { items: Array<{ test_name: string; explanation_en: string; explanation_ur: string; next_step: string }>; disclaimer: string };
  urgency: { urgency: "Routine" | "Needs Attention" | "Urgent"; reasoning: string };
  scheduling: { chosen_slot: { doctor_name: string; specialty: string; date: string; time: string; hospital_type: "government" | "private" }; reason: string };
};

const API_BASE = import.meta.env["VITE_API_BASE_URL"] || "http://localhost:8000";
const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
const steps = ["Reading report", "Preparing explanation", "Checking urgency", "Finding appointment"];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Sehat Sahulat | Understand Your Lab Report" },
    { name: "description", content: "Upload a lab report for clear English and Urdu guidance, urgency checks, and a suggested appointment." },
    { property: "og:title", content: "Sehat Sahulat | Clear Lab Report Guidance" },
    { property: "og:description", content: "Understand your lab report in simple English and Urdu." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Brand() {
  return <div className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><HeartPulse className="size-5" /></span><span className="font-display text-lg font-bold">Sehat Sahulat</span></div>;
}

function Index() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "results">("idle");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<ReportResult | null>(null);
  const [error, setError] = useState("");
  const uploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useEffect(() => {
    if (status !== "loading") return;
    const timer = window.setInterval(() => setStep((current) => Math.min(current + 1, steps.length - 1)), 3200);
    return () => window.clearInterval(timer);
  }, [status]);

  const chooseFile = useCallback((next: File | undefined) => {
    setError("");
    if (!next || !acceptedTypes.includes(next.type)) { setError("Please upload a JPEG, PNG, or WEBP image"); return; }
    if (next.size > 12 * 1024 * 1024) { setError("Please choose an image smaller than 12 MB"); return; }
    if (preview) URL.revokeObjectURL(preview);
    setFile(next); setPreview(URL.createObjectURL(next)); setResult(null); setStatus("idle");
  }, [preview]);

  const analyze = async () => {
    if (!file) return;
    setError(""); setStatus("loading"); setStep(0);
    const data = new FormData(); data.append("file", file);
    try {
      const response = await fetch(`${API_BASE}/api/process`, { method: "POST", body: data });
      if (!response.ok) {
        if (response.status === 400) throw new Error("Please upload a JPEG, PNG, or WEBP image");
        if (response.status === 422) throw new Error("Could not read this report clearly. Please try a clearer photo.");
        throw new Error("Something went wrong processing your report. Please try again.");
      }
      setResult(await response.json() as ReportResult); setStatus("results");
      window.setTimeout(() => document.querySelector("#results")?.scrollIntoView({ behavior: "smooth" }), 60);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong processing your report. Please try again.");
      setStatus("idle");
    }
  };

  const drop = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]); };

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <header className="absolute inset-x-0 top-0 z-20 h-20 border-b border-foreground/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 lg:px-8">
          <Brand />
          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex"><a href="#how" className="hover:text-primary">How it works</a><a href="#upload" className="hover:text-primary">Analyze report</a><span className="flex items-center gap-2 text-muted-foreground"><ShieldCheck className="size-4 text-primary" /> Private & secure</span></nav>
          <Button size="sm" asChild><a href="#upload">Get started <ArrowRight className="size-4" /></a></Button>
        </div>
      </header>

      <section className="relative min-h-[760px] pt-20 lg:min-h-[820px]">
        <img src={heroImage} alt="Doctor explaining a lab report to a patient" width={1600} height={1100} fetchPriority="high" className="absolute inset-0 size-full object-cover object-[66%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/10" />
        <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center px-5 py-16 lg:min-h-[740px] lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div className="max-w-2xl animate-rise">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-primary backdrop-blur"><span className="size-2 rounded-full bg-primary" /> Healthcare, made understandable</div>
            <h1 className="font-display text-5xl font-semibold leading-[1.06] text-hero sm:text-6xl lg:text-7xl">Your health.<br /><span className="text-primary">Clearly explained.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">Upload your lab report and receive a simple explanation in English and Urdu, an urgency check, and a care suggestion.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4"><Button size="lg" asChild><a href="#upload"><UploadCloud className="size-5" /> Analyze my report</a></Button><span className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="size-5 text-primary" /> Your report stays private</span></div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-hero/94 text-primary-foreground backdrop-blur"><div className="mx-auto grid max-w-7xl gap-4 px-5 py-5 sm:grid-cols-3 lg:px-8">{[["01","Upload a clear photo"],["02","We simplify the results"],["03","Know your next step"]].map(([n,t]) => <div key={n} className="flex items-center gap-3"><span className="font-display text-xs text-primary-foreground/55">{n}</span><span className="text-sm font-semibold">{t}</span></div>)}</div></div>
      </section>

      <section id="how" className="border-b border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Made for real people</p><h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">Less medical jargon.<br />More peace of mind.</h2></div><p className="max-w-2xl text-base leading-7 text-muted-foreground">A report can feel overwhelming. Sehat Sahulat turns complex values into clear guidance, while helping you understand when—and where—to seek care.</p></div></div>
      </section>

      <section id="upload" className="py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mb-10 text-center"><p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Your report, simplified</p><h2 className="mt-4 font-display text-3xl font-semibold sm:text-5xl">Start with a clear photo</h2><p className="mx-auto mt-4 max-w-xl text-muted-foreground">Use a well-lit image where all test names and values are easy to see.</p></div>
          <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-soft">
            {status === "loading" ? <LoadingState activeStep={step} preview={preview} /> : (
              <div className="p-5 sm:p-8">
                <div onDragOver={(e) => e.preventDefault()} onDrop={drop} onClick={() => uploadRef.current?.click()} className={cn("relative min-h-[340px] cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-colors", file ? "border-primary/35 bg-secondary/35" : "grid place-items-center border-border bg-muted/45 hover:border-primary/50")}>
                  <input ref={uploadRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => chooseFile(e.target.files?.[0])} />
                  {file ? <><img src={preview} alt="Selected lab report preview" className="absolute inset-0 size-full object-contain p-5" /><div className="pointer-events-none absolute inset-x-6 top-5 h-px bg-primary/70 shadow-[0_0_16px_var(--primary)] animate-scan" /><Button type="button" size="icon" variant="secondary" aria-label="Remove selected image" className="absolute right-4 top-4 z-10" onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(""); }}><X className="size-4" /></Button><div className="absolute inset-x-0 bottom-0 bg-hero/85 px-5 py-4 text-primary-foreground backdrop-blur"><div className="flex items-center gap-3"><FileImage className="size-5" /><div className="min-w-0"><p className="truncate text-sm font-bold">{file.name}</p><p className="text-xs text-primary-foreground/70">{(file.size / 1024 / 1024).toFixed(1)} MB · Ready to analyze</p></div></div></div></> : <div className="px-6 text-center"><span className="mx-auto grid size-16 place-items-center rounded-2xl bg-secondary text-primary"><UploadCloud className="size-7" /></span><p className="mt-5 font-display text-xl font-semibold">Drop your lab report here</p><p className="mt-2 text-sm text-muted-foreground">or click to browse · JPEG, PNG or WEBP</p></div>}
                </div>
                {error && <div role="alert" className="mt-5 flex items-start gap-3 rounded-xl bg-urgent-soft p-4 text-sm font-semibold text-urgent"><CircleAlert className="mt-0.5 size-5 shrink-0" />{error}</div>}
                <div className="mt-6 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row"><p className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-primary" /> Securely processed. Never shared.</p><Button size="lg" disabled={!file} onClick={analyze} className="w-full sm:w-auto">Analyze report <ArrowRight className="size-4" /></Button></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {status === "results" && result && <Results result={result} onReset={() => { setFile(null); setPreview(""); setResult(null); setStatus("idle"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />}

      <footer className="border-t border-border bg-card"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8"><Brand /><p className="text-xs text-muted-foreground">Clear guidance. Compassionate care. Always consult a qualified doctor.</p></div></footer>
    </main>
  );
}

function LoadingState({ activeStep, preview }: { activeStep: number; preview: string }) {
  return <div className="grid min-h-[470px] lg:grid-cols-[.9fr_1.1fr]"><div className="relative min-h-[280px] overflow-hidden bg-muted"><img src={preview} alt="Your lab report being analyzed" className="size-full object-contain p-8 opacity-70" /><div className="absolute inset-x-8 top-8 h-px bg-primary shadow-[0_0_18px_var(--primary)] animate-scan" /></div><div className="flex flex-col justify-center p-8 sm:p-12"><p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Analysis in progress</p><h3 className="mt-3 font-display text-3xl font-semibold">We’re reading your report</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">This usually takes 10–30 seconds. Please keep this page open.</p><div className="mt-8 space-y-5">{steps.map((label, index) => <div key={label} className={cn("flex items-center gap-4 transition-opacity", index > activeStep ? "opacity-35" : "opacity-100")}><span className={cn("grid size-8 place-items-center rounded-full border", index < activeStep ? "border-primary bg-primary text-primary-foreground" : index === activeStep ? "border-primary bg-secondary text-primary" : "border-border")} >{index < activeStep ? <Check className="size-4" /> : <span className={cn("size-2 rounded-full", index === activeStep && "animate-pulse bg-primary")} />}</span><span className="text-sm font-semibold">{label}{index === activeStep ? "…" : ""}</span></div>)}</div></div></div>;
}

function Results({ result, onReset }: { result: ReportResult; onReset: () => void }) {
  const [language, setLanguage] = useState<"en" | "ur">("en");
  const urgency = result.urgency.urgency;
  const urgencyTone = urgency === "Routine" ? "bg-routine-soft text-routine" : urgency === "Needs Attention" ? "bg-attention-soft text-attention" : "bg-urgent-soft text-urgent";
  const slot = result.scheduling.chosen_slot;
  return <section id="results" className="border-t border-border bg-card py-20 sm:py-28"><div className="mx-auto max-w-6xl px-5">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-primary"><CheckCircle2 className="size-4" /> Analysis complete</p><h2 className="mt-3 font-display text-4xl font-semibold">Your report, explained</h2></div><Button variant="secondary" onClick={onReset}><RotateCcw className="size-4" /> Analyze another</Button></div>
    <div className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-border p-6 sm:p-8"><div className="flex items-center justify-between"><h3 className="font-display text-xl font-semibold">Extracted values</h3><span className="text-xs font-semibold text-muted-foreground">{result.extraction.values.length} tests found</span></div><div className="mt-6 divide-y divide-border">{result.extraction.values.map((item) => <div key={`${item.test_name}-${item.value}`} className="grid gap-2 py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-8"><div className="flex items-center gap-3"><span className={cn("size-2.5 rounded-full", item.flag === "normal" ? "bg-routine" : item.flag === "low" ? "bg-low" : item.flag === "high" ? "bg-urgent" : "bg-muted-foreground")} /><span className="font-semibold">{item.test_name}</span></div><p className="text-lg font-bold">{item.value} <span className="text-xs font-medium text-muted-foreground">{item.unit}</span></p><div className="sm:text-right"><span className={cn("rounded-full px-3 py-1 text-xs font-bold uppercase", item.flag === "normal" ? "bg-routine-soft text-routine" : item.flag === "low" ? "bg-low-soft text-low" : item.flag === "high" ? "bg-urgent-soft text-urgent" : "bg-muted text-muted-foreground")}>{item.flag}</span><p className="mt-1 text-xs text-muted-foreground">Range {item.reference_range}</p></div></div>)}</div></section>
        <section className="rounded-2xl border border-border p-6 sm:p-8"><div className="flex flex-wrap items-center justify-between gap-4"><h3 className="font-display text-xl font-semibold">What this means</h3><div className="flex rounded-full bg-muted p-1"><Button size="sm" variant={language === "en" ? "primary" : "ghost"} onClick={() => setLanguage("en")}><Languages className="size-4" /> English</Button><Button size="sm" variant={language === "ur" ? "primary" : "ghost"} onClick={() => setLanguage("ur")}>اردو</Button></div></div><div className="mt-6 space-y-5">{result.interpretation.items.map((item) => <article key={item.test_name} className="border-l-2 border-primary pl-5"><h4 className="font-semibold">{item.test_name}</h4><p dir={language === "ur" ? "rtl" : "ltr"} className="mt-2 text-sm leading-7 text-muted-foreground">{language === "en" ? item.explanation_en : item.explanation_ur}</p><p className="mt-3 text-sm"><strong>Next step:</strong> {item.next_step}</p></article>)}</div></section>
      </div>
      <div className="space-y-6">
        <section className="rounded-2xl border border-border p-6"><div className="flex items-center justify-between"><h3 className="font-display text-lg font-semibold">Urgency check</h3><span className={cn("rounded-full px-3 py-1.5 text-xs font-bold", urgencyTone)}>{urgency}</span></div><p className="mt-4 text-sm leading-6 text-muted-foreground">{result.urgency.reasoning}</p></section>
        <section className="overflow-hidden rounded-2xl bg-hero text-primary-foreground"><div className="p-6"><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground/60">Suggested appointment</p><div className="mt-5 flex items-center gap-4"><span className="grid size-12 place-items-center rounded-xl bg-primary-foreground/10"><Stethoscope className="size-6" /></span><div><h3 className="font-display text-lg font-semibold">{slot.doctor_name}</h3><p className="text-sm text-primary-foreground/65">{slot.specialty}</p></div></div><div className="mt-6 grid gap-4 border-t border-primary-foreground/15 pt-5 text-sm"><p className="flex items-center gap-3"><CalendarDays className="size-4 text-accent" /> {new Date(`${slot.date}T00:00:00`).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}</p><p className="flex items-center gap-3"><Clock3 className="size-4 text-accent" /> {slot.time}</p><p className="flex items-center gap-3 capitalize"><MapPin className="size-4 text-accent" /> {slot.hospital_type} hospital</p></div></div><div className="bg-primary-foreground/5 px-6 py-4 text-xs leading-5 text-primary-foreground/65">{result.scheduling.reason}</div></section>
        <AppointmentForm />
      </div>
    </div>
    <div className="mt-8 flex items-start gap-3 rounded-xl bg-muted p-5 text-sm leading-6 text-muted-foreground"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" /><p>{result.interpretation.disclaimer || "This is not a medical diagnosis. Please consult a doctor for confirmation."}</p></div>
  </div></section>;
}

function AppointmentForm() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true); };
  if (sent) return <div className="rounded-2xl border border-routine/25 bg-routine-soft p-6 text-center"><CheckCircle2 className="mx-auto size-8 text-routine" /><h3 className="mt-3 font-display text-lg font-semibold">Request received</h3><p className="mt-2 text-sm text-muted-foreground">The care team will contact you shortly.</p></div>;
  return <form onSubmit={submit} className="rounded-2xl border border-border p-6"><h3 className="font-display text-lg font-semibold">Request this appointment</h3><div className="mt-5 space-y-3"><label className="relative block"><UserRound className="absolute left-3 top-3.5 size-4 text-muted-foreground" /><input required aria-label="Full name" placeholder="Full name" className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></label><label className="relative block"><Phone className="absolute left-3 top-3.5 size-4 text-muted-foreground" /><input required type="tel" aria-label="Phone number" placeholder="Phone number" className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></label><label className="relative block"><CalendarDays className="absolute left-3 top-3.5 size-4 text-muted-foreground" /><select aria-label="Preferred day" className="h-11 w-full appearance-none rounded-lg border border-input bg-background pl-10 pr-9 text-sm outline-none focus:border-primary"><option>Tomorrow</option><option>This week</option><option>Next week</option></select><ChevronDown className="pointer-events-none absolute right-3 top-3.5 size-4 text-muted-foreground" /></label></div><Button type="submit" className="mt-4 w-full">Send request <ArrowRight className="size-4" /></Button></form>;
}
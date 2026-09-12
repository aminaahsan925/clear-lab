import { Link } from "@tanstack/react-router";
import { ArrowRight, HeartPulse, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
        <HeartPulse className="size-5" />
      </span>
      <span className="font-display text-lg font-bold">Sehat Sahulat</span>
    </Link>
  );
}

export function SiteHeader({ floating = false }: { floating?: boolean }) {
  return (
    <header
      className={
        (floating ? "absolute" : "sticky") +
        " inset-x-0 top-0 z-30 h-20 border-b border-foreground/10 bg-background/80 backdrop-blur-xl"
      }
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 lg:px-8">
        <Brand />
        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/how-it-works" className="hover:text-primary">How it works</Link>
          <Link to="/mentor" className="hover:text-primary">AI mentor</Link>
          <span className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" /> Private &amp; secure
          </span>
        </nav>
        <Button size="sm" asChild>
          <Link to="/" hash="upload">Analyze report <ArrowRight className="size-4" /></Link>
        </Button>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-3 lg:px-8">
        <div className="space-y-3">
          <Brand />
          <p className="max-w-xs text-sm leading-6 text-muted-foreground">
            Lab reports translated into plain English and Urdu, with an urgency check and a care suggestion.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-display font-semibold">Explore</p>
          <Link to="/" className="block text-muted-foreground hover:text-primary">Analyze a report</Link>
          <Link to="/how-it-works" className="block text-muted-foreground hover:text-primary">How it works</Link>
          <Link to="/mentor" className="block text-muted-foreground hover:text-primary">AI health mentor</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-display font-semibold">Good to know</p>
          <p className="text-muted-foreground">Your report is processed securely and never shared.</p>
          <p className="text-muted-foreground">Always consult a qualified doctor before acting on results.</p>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        Clear guidance. Compassionate care.
      </div>
    </footer>
  );
}

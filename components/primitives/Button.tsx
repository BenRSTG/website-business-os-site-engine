import { cn } from "@/lib/cn";
import { resolveHref } from "@/lib/site-context";

type Variant = "primary" | "secondary" | "onImage";

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 px-6 py-3 text-base font-semibold no-underline transition focus-visible:outline-offset-2";

const VARIANTS: Record<Variant, string> = {
  primary:
    "border border-[var(--t-btn-border)] bg-[var(--t-btn-bg)] text-[var(--t-btn-fg)] hover:bg-[var(--t-btn-hover-bg)] hover:brightness-110 rounded-[var(--t-btn-radius)]",
  secondary:
    "border border-ink/25 bg-transparent text-ink hover:bg-ink/5 rounded-[var(--t-btn-radius)]",
  onImage:
    "border border-white/70 bg-transparent text-white hover:bg-white/15 rounded-[var(--t-btn-radius)]",
};

export function Button({
  href,
  base,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  base: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={resolveHref(href, base)} className={cn(BASE, VARIANTS[variant], className)}>
      {children}
    </a>
  );
}

export function SubmitButton({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      className={cn(BASE, VARIANTS.primary, "cursor-pointer disabled:cursor-not-allowed disabled:opacity-60", className)}
    >
      {children}
    </button>
  );
}

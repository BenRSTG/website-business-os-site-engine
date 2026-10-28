import { cn } from "@/lib/cn";

export function SectionContainer({
  id,
  tone = "plain",
  className,
  innerClassName,
  children,
}: {
  id?: string;
  tone?: "plain" | "surface";
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("section-y", tone === "surface" && "bg-surface", className)}>
      <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", innerClassName)}>{children}</div>
    </section>
  );
}

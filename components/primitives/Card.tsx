import { cn } from "@/lib/cn";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-box border border-line bg-surface p-6 shadow-box", className)}>{children}</div>
  );
}

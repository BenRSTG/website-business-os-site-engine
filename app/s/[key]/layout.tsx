// Interne Zielroute des Proxys: /s/<schlüssel>/…; der Schlüssel steht für Vorschau-Slug oder Kundendomain.
export default function TenantLayout({ children }: LayoutProps<"/s/[key]">) {
  return children;
}

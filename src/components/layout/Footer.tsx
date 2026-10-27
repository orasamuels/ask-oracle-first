import { Link } from "@tanstack/react-router";
import { APP_NAME, NAV_ITEMS } from "@/config/navigation";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wider">{APP_NAME}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Measuring intelligence — human and machine.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {NAV_ITEMS.map((i) => (
            <Link key={i.to} to={i.to} className="text-xs text-muted-foreground hover:text-foreground">
              {i.label}
            </Link>
          ))}
        </nav>
        <p className="font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} · Phase 1
        </p>
      </div>
    </footer>
  );
}

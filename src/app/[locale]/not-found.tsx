import {Link} from "@/i18n/routing";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-muted">404</p>
        <h1 className="mt-4 text-3xl font-light">Page not found</h1>
        <Link className="mt-8 inline-flex rounded-full border px-5 py-2 text-sm" href="/">
          Back home
        </Link>
      </div>
    </main>
  );
}

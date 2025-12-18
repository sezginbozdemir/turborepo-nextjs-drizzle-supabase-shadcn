export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-6 py-12">
        {/* Hero */}
        <section className="text-center mb-16">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-100">
            Turbo monorepo · TypeScript everywhere
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Turbo Next&nbsp;/&nbsp;Express Monorepo Boilerplate
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-slate-600">
            A full‑stack starter template built with Turborepo, Next.js,
            Express, Drizzle ORM, Supabase, and shadcn/ui. Designed for shared
            code, clean architecture, and fast iteration.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="https://turbo.build/repo"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-black transition"
            >
              View Turborepo docs
            </a>
            <a
              href="https://github.com/sezginbozdemir/turborepo-nextjs-drizzle-supabase-shadcn"
              className="inline-flex items-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Open repository
            </a>
          </div>
        </section>

        {/* Layout overview */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Monorepo layout
          </h2>
          <p className="text-sm text-slate-600 mb-6 max-w-2xl">
            This project is organized as a Turborepo monorepo with separate apps
            for the frontend and backend, plus shared packages for common logic,
            configuration, and UI components.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Apps */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">
                apps/
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>
                  <span className="font-mono text-xs rounded bg-slate-100 px-2 py-0.5 mr-2">
                    client
                  </span>
                  Next.js frontend using TypeScript and shadcn/ui.
                </li>
                <li>
                  <span className="font-mono text-xs rounded bg-slate-100 px-2 py-0.5 mr-2">
                    server
                  </span>
                  Express API powered by Drizzle ORM and Supabase.
                </li>
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                For setup and usage, see the README inside each app directory.
              </p>
            </div>

            {/* Packages */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">
                packages/
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>
                  <span className="font-mono text-xs rounded bg-slate-100 px-2 py-0.5 mr-2">
                    database
                  </span>
                  Drizzle schema definitions and database utilities.
                </li>
                <li>
                  <span className="font-mono text-xs rounded bg-slate-100 px-2 py-0.5 mr-2">
                    env-loader
                  </span>
                  Centralized environment loading and validation.
                </li>
                <li>
                  <span className="font-mono text-xs rounded bg-slate-100 px-2 py-0.5 mr-2">
                    mailer
                  </span>
                  Email templates and sending helpers.
                </li>
                <li>
                  <span className="font-mono text-xs rounded bg-slate-100 px-2 py-0.5 mr-2">
                    shared
                  </span>
                  Shared utilities and domain logic.
                </li>
                <li>
                  <span className="font-mono text-xs rounded bg-slate-100 px-2 py-0.5 mr-2">
                    ui
                  </span>
                  Reusable UI components.
                </li>
                <li>
                  <span className="font-mono text-xs rounded bg-slate-100 px-2 py-0.5 mr-2">
                    typescript-config
                  </span>
                  Base TypeScript configuration.
                </li>
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                Refer to each package&apos;s README for installation and
                integration details.
              </p>
            </div>
          </div>
        </section>

        {/* Getting started */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Getting started
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 max-w-xl">
            <li>Install dependencies at the monorepo root.</li>
            <li>
              Configure environment variables using the env-loader package.
            </li>
            <li>Run the frontend and backend apps with Turborepo scripts.</li>
          </ol>
          <p className="mt-4 text-xs text-slate-500">
            For detailed commands and configuration, see the root README and the
            individual READMEs in <code className="font-mono">apps/</code> and{" "}
            <code className="font-mono">packages/</code>.
          </p>
        </section>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";

const ticker = [
  "React",
  "Next.js",
  "MongoDB",
  "TypeScript",
  "Node",
  "Python",
  "Go",
  "Rust",
  "Figma",
  "Postgres",
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="relative mx-auto grid min-h-[78vh] max-w-6xl items-end gap-10 px-6 pb-16 pt-12 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="mb-4 text-xs tracking-[0.35em] text-signal uppercase">
            01 — Collaboration foundry
          </p>
          <h1 className="display text-[14vw] text-paper md:text-[7.4rem]">
            FIND YOUR
            <br />
            <span className="text-ember">CREW.</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-fog">
            DevCollab is a workshop for builders who want teammates, not
            job boards. Post a project, apply with your stack, and ship in
            public with people who actually write code.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="cut-btn bg-ember px-7 py-3 text-sm font-semibold text-ink"
            >
              Enter the foundry
            </Link>
            <Link
              href="/login"
              className="cut-btn border border-line px-7 py-3 text-sm text-paper"
            >
              I already have a desk
            </Link>
          </div>
        </div>

        <div className="cut-frame p-6">
          <p className="text-xs tracking-[0.28em] text-fog uppercase">
            Tonight’s floor
          </p>
          <div className="mt-6 space-y-5">
            {[
              ["Open benches", "Find live projects looking for a stack match."],
              ["Owner desks", "Review applicants and keep the room closed or open."],
              ["Signal chat", "Talk only with people who already joined the build."],
            ].map(([title, copy], i) => (
              <div key={title} className="border-t border-line pt-4">
                <p className="display text-2xl text-paper">
                  <span className="mr-2 text-ember">0{i + 1}</span>
                  {title}
                </p>
                <p className="mt-1 text-sm text-fog">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="marquee">
        <div className="marquee-track py-3 text-xs tracking-[0.35em] text-fog uppercase">
          {[...ticker, ...ticker].map((item, i) => (
            <span key={`${item}-${i}`}>
              {item} <span className="text-ember">◆</span>
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="display text-5xl md:text-7xl">
          Not another
          <br />
          <span className="text-signal">feed.</span>
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              k: "02",
              t: "Apply with a stack",
              d: "Owners see your tools first. No résumés, no noise.",
            },
            {
              k: "03",
              t: "Own the room",
              d: "Accept, reject, and flip a project from open to closed in one motion.",
            },
            {
              k: "04",
              t: "Build in-channel",
              d: "Project chat stays with the people who were actually invited in.",
            },
          ].map((item) => (
            <article key={item.k} className="cut-frame p-6">
              <p className="text-ember">{item.k}</p>
              <h3 className="display mt-3 text-3xl">{item.t}</h3>
              <p className="mt-3 text-sm leading-6 text-fog">{item.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mb-16 max-w-6xl px-6">
        <div className="cut-frame flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs tracking-[0.3em] text-signal uppercase">
              Last call
            </p>
            <h2 className="display mt-3 text-4xl md:text-6xl">
              Ready to sit
              <br />
              at a real bench?
            </h2>
          </div>
          <Link
            href="/register"
            className="cut-btn bg-signal px-8 py-3 font-semibold text-ink"
          >
            Create your profile
          </Link>
        </div>
        <p className="mt-8 text-center text-xs tracking-[0.2em] text-fog uppercase">
          © {new Date().getFullYear()} DevCollab — built for people who ship
        </p>
      </section>
    </div>
  );
}

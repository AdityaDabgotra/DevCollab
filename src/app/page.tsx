"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 text-[#1e0e4b]">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 bg-white shadow-sm">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Build. Collaborate. <span className="text-[#7747ff]">Ship.</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mb-8">
          DevCollab helps developers find teammates, work on real projects,
          and grow together. Join projects, showcase your skills, and
          collaborate with like-minded builders.
        </p>

        <div className="flex gap-4">
          <Link
            href="/register"
            className="bg-[#7747ff] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#5f37d6] transition"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="border border-[#7747ff] text-[#7747ff] px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#7747ff]/10 transition"
          >
            Login
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">
          Why DevCollab?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Find Teammates",
              desc: "Discover developers with the right tech stack and collaborate on meaningful projects.",
            },
            {
              title: "Join Real Projects",
              desc: "Work on open projects to gain experience and build a strong portfolio.",
            },
            {
              title: "Showcase Skills",
              desc: "Highlight your tech stack and contributions to stand out.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-[#7747ff]/10 text-[#7747ff] rounded-lg mb-4 font-bold">
                {i + 1}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-6">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-16 px-6">
        <h2 className="text-2xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            "Create your developer profile",
            "Join or post collaboration projects",
            "Build together and grow your portfolio",
          ].map((step, i) => (
            <div key={i}>
              <div className="w-12 h-12 mx-auto flex items-center justify-center bg-[#7747ff] text-white rounded-full font-bold mb-4">
                {i + 1}
              </div>
              <p className="text-sm text-gray-600">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-16 px-6">
        <h2 className="text-2xl font-bold mb-4">
          Ready to start collaborating?
        </h2>
        <p className="text-gray-500 mb-6">
          Join DevCollab today and work on real-world projects with amazing developers.
        </p>

        <Link
          href="/register"
          className="bg-[#7747ff] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#5f37d6] transition"
        >
          Create Your Profile
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-400 pb-6">
        © {new Date().getFullYear()} DevCollab. Built for developers.
      </footer>
    </div>
  );
}
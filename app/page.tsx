import Navbar from "@/components/navbar";
import Link from "next/link";
import { Link2, Clock2 as Click2, Calendar, Zap, BarChart3, Shield } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Link2,
      title: "Custom Short Codes",
      description: "Create branded, memorable short links that match your brand identity.",
    },
    {
      icon: Click2,
      title: "Max Clicks Limit",
      description: "Set maximum click limits to control link usage and prevent abuse.",
    },
    {
      icon: Calendar,
      title: "Custom Expiry Dates",
      description: "Automatically expire links after a specific date or time.",
    },
    {
      icon: Zap,
      title: "Instant Activation",
      description: "Toggle links on/off instantly without creating new ones.",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track clicks, locations, devices, and referrers in real-time dashboards.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Password protection and advanced tracking features for sensitive links.",
    },
  ];

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-20 animate-pulse" />


      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-32 px-4 sm:px-6 md:px-8">
        {/* New badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 backdrop-blur-sm">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-cyan-300">New: Real-time Analytics Dashboard</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-center tracking-tight mb-8 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent max-w-4xl">
          Shorten URLs.
          <br />
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Track Everything.</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-white/70 text-center mb-12 max-w-2xl leading-relaxed">
          The all-in-one platform for creating, managing, and analyzing short links. 
          Control expiry dates, click limits, and get instant insights into your audience.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 text-center"
          >
            Get Started Free
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-300 hover:border-white/30 text-center"
          >
            Explore Features
          </Link>
        </div>

        {/* Social proof */}
        <div className="text-center mb-16">
          <p className="text-white/60 text-sm mb-4">Trusted by 10,000+ teams worldwide</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="text-white/40 text-xs font-semibold">TECH</div>
            <div className="text-white/40 text-xs font-semibold">STARTUP</div>
            <div className="text-white/40 text-xs font-semibold">SCALE</div>
            <div className="text-white/40 text-xs font-semibold">AGENCY</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Everything you need to manage, track, and optimize your short links in one beautiful platform.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 rounded-2xl transition-all duration-300" />

                  {/* Glass shine effect */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:from-cyan-500/40 group-hover:to-blue-500/40 transition-all duration-300">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-white/60 leading-relaxed">{feature.description}</p>

                    {/* Arrow indicator */}
                    <div className="mt-6 inline-flex items-center gap-2 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-semibold">Learn more</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 p-12 md:p-16 text-center relative overflow-hidden">
            {/* Glass shine effects */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500/20 to-transparent rounded-full blur-3xl opacity-50" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to shorten your links?
              </h2>
              <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
                Join thousands of teams already using URL Shortener to create, manage, and track their links.
              </p>
              <Link
                href="/dashboard"
                className="inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
              >
                Start Creating Links Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer accent */}
      <div className="relative z-10 text-center py-8 px-4 text-white/40 text-sm border-t border-white/10">
        <p>No credit card required • Free plan includes 100 links • Upgrade anytime</p>
      </div>
    </main>
  );
}

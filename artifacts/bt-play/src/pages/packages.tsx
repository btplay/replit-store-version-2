import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Users, MapPin, Sparkles } from "lucide-react";

const packages = [
  {
    name: "Premium",
    tagline: "Everything you need for a beautifully styled toddler party.",
    price: "£100",
    badge: null,
    color: "#B5C2B7",
    features: [
      "10ft² bouncy castle",
      "10ft² soft play pen",
      "Ball pit",
      "Birthday decor included",
      "Professional delivery & setup",
      "Full collection & sanitisation",
    ],
    details: { guests: "Up to 10 toddlers", duration: "3 hours", ages: "0–4 years", setup: "~45 minutes" },
    pricing: [
      { label: "3 Hours", value: "£100" },
    ],
    note: "No optional extras available on this package.",
    noExtras: true,
  },
  {
    name: "Luxury",
    tagline: "Our most loved package — everything Premium plus extras for a truly special celebration.",
    price: "£180",
    badge: "Recommended",
    color: "#9EAFA1",
    features: [
      "Everything in Premium",
      "Up to 20 children",
      "Extra toys & ride-on cars",
      "Soft play shapes & mats",
      "Personalised decor",
      "Optional time extension (+£20/hr)",
      "Optional child increase (+£15/child)",
      "Professional delivery & setup",
      "Full collection & sanitisation",
    ],
    details: { guests: "Up to 20 children", duration: "3 hours (extendable)", ages: "0–4 years", setup: "~60 minutes" },
    pricing: [
      { label: "3 Hours", value: "£180" },
      { label: "Extra Hour", value: "+£20/hr" },
      { label: "Extra Child", value: "+£15/child" },
    ],
    note: "Optional extras can be added — let us know in the booking form.",
    noExtras: false,
  },
];

export default function Packages() {
  return (
    <div className="w-full bg-white min-h-screen pb-32">
      <div className="bg-white border-b border-slate-100 pt-32 pb-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="inline-block py-1 px-3 rounded-full bg-sage-50 text-sage-700 text-xs font-bold tracking-widest uppercase mb-6 border border-sage-100">
            Our Packages
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-slate-900 mb-6">Pricing & Details</h1>
          <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
            Two beautifully styled packages — professionally delivered, set up and collected across Hertfordshire and surrounding counties.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
        {packages.map((pkg, i) => (
          <motion.div
            key={pkg.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="bg-white border-2 shadow-sm relative overflow-hidden"
            style={{ borderColor: pkg.badge ? pkg.color : "#e2e8f0" }}
          >
            {pkg.badge && (
              <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-[#B5C2B7] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5">
                <Sparkles className="w-3 h-3" /> {pkg.badge}
              </div>
            )}

            <div className="p-10 md:p-14">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 pb-12 border-b border-slate-100">
                <div>
                  <h2 className="text-4xl font-serif text-slate-900 mb-2">{pkg.name}</h2>
                  <p className="text-2xl font-serif mb-4" style={{ color: pkg.color }}>{pkg.price}</p>
                  <p className="text-slate-500 mb-8 leading-relaxed">{pkg.tagline}</p>

                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2"><Users className="w-4 h-4 shrink-0" style={{ color: pkg.color }} /><span>{pkg.details.guests}</span></div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4 shrink-0" style={{ color: pkg.color }} /><span>{pkg.details.duration}</span></div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: pkg.color }} /><span>Suitable ages: {pkg.details.ages}</span></div>
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" style={{ color: pkg.color }} /><span>Hertfordshire & surrounding counties</span></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold tracking-widest uppercase text-slate-900 mb-6">What's Included</h4>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3 text-slate-600 text-sm">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: pkg.color }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-slate-50 p-8 mb-10">
                <h3 className="text-xs font-bold tracking-widest uppercase text-slate-900 mb-6">Pricing</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {pkg.pricing.map((p) => (
                    <div key={p.label} className="text-center p-4 bg-white border border-slate-100">
                      <div className="text-2xl font-serif text-slate-900 mb-1">{p.value}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-widest">{p.label}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-4 leading-relaxed">{pkg.note}</p>
              </div>

              <Button asChild className="w-full h-14 tracking-widest uppercase text-xs text-white border-none" style={{ backgroundColor: pkg.color }}>
                <Link href={`/contact?package=${pkg.name}`}>Book {pkg.name}</Link>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delivery info */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="bg-slate-50 border border-slate-100 p-8">
          <h3 className="text-xs font-bold tracking-widest uppercase text-slate-900 mb-4">Delivery Charges</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
            <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /><div><strong>Free</strong> — Within Hertfordshire (AL, HP, SG, WD postcodes)</div></div>
            <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" /><div><strong>+£15</strong> — Just outside Hertfordshire (EN, LU, CM, HA and nearby areas)</div></div>
            <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-red-400 mt-0.5 shrink-0" /><div><strong>+£50</strong> — 20+ miles from Hertfordshire</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

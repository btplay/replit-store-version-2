import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useListPackages, getListPackagesQueryKey, useListTestimonials, getListTestimonialsQueryKey } from "@workspace/api-client-react";
import { ArrowRight, ShieldCheck, Sparkles, HeartHandshake, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";

export default function Home() {
  const { data: packages, isLoading: isLoadingPackages } = useListPackages({ query: { queryKey: getListPackagesQueryKey() } });
  const { data: testimonials, isLoading: isLoadingTestimonials } = useListTestimonials({ query: { queryKey: getListTestimonialsQueryKey() } });

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/60 z-10" />
          <img src="/images/hero.png" alt="Luxury soft play setup" className="w-full h-full object-cover object-center" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="max-w-3xl">
            <span className="inline-block py-1 px-3 rounded-full bg-sage-50 text-sage-700 text-xs font-bold tracking-widest uppercase mb-8 border border-sage-100">Premium Event Hire</span>
            <h1 className="text-5xl md:text-7xl font-serif text-slate-900 leading-tight mb-8">Luxury Soft Play Hire for Stylish Little Celebrations</h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl font-light">Beautifully styled toddler soft play setups designed to make every celebration unforgettable. Safe, modern and luxury play experiences for birthdays, baby showers and special family events.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-[#B5C2B7] hover:bg-[#9EAFA1] text-white border-none h-14 px-8 tracking-widest uppercase text-xs">
                <Link href="/packages">View Packages</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-slate-300 hover:border-[#B5C2B7] hover:text-[#B5C2B7] h-14 px-8 tracking-widest uppercase text-xs bg-transparent text-slate-700">
                <Link href="/contact">Book Now</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
            <h2 className="text-4xl font-serif text-slate-900 mb-4">Our Packages</h2>
            <p className="text-slate-500 text-lg font-light">Professionally styled, delivered, and collected — two ways to celebrate.</p>
          </motion.div>

          {isLoadingPackages ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[0,1].map(i => <div key={i} className="bg-white p-10 border border-slate-100 h-[300px]"><Skeleton className="w-1/3 h-8 mb-4" /><Skeleton className="w-1/2 h-4 mb-8" /></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {packages?.slice(0, 2).map((pkg, i) => (
                <motion.div key={pkg.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`bg-white p-10 flex flex-col group hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.07)] transition-all duration-500 relative ${pkg.popular ? "border-2 border-[#B5C2B7]" : "border border-slate-100"}`}>
                  {pkg.popular && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#B5C2B7] text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1">
                      <Sparkles className="w-2.5 h-2.5" /> Recommended
                    </div>
                  )}
                  <h3 className="text-2xl font-serif text-slate-900 mb-2">{pkg.name}</h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">{pkg.tagline}</p>
                  <ul className="space-y-2 mb-8 flex-1">
                    {pkg.features.slice(0, 5).map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-slate-600 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#B5C2B7] mt-0.5 shrink-0" />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-serif text-slate-900">{pkg.priceFrom}</div>
                      {pkg.popular && <div className="text-xs text-slate-500 mt-0.5">+£20/hr · +£15/extra child</div>}
                    </div>
                    <Button asChild className="bg-[#B5C2B7] hover:bg-[#9EAFA1] text-white border-none uppercase tracking-widest text-xs h-10 px-6">
                      <Link href="/contact">Book Now</Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative aspect-[4/5] bg-slate-50">
              <img src="/images/gallery-3.png" alt="Luxury styling details" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-xl">
              <h2 className="text-4xl font-serif text-slate-900 mb-8">Luxury Play, Beautifully Styled</h2>
              <div className="space-y-6 text-slate-600 font-light leading-relaxed text-lg">
                <p>We believe that children's entertainment shouldn't compromise the aesthetic of your beautifully planned event. That's why we created BT Play — premium soft play hire in sophisticated white and grey tones, designed to blend seamlessly into your styling.</p>
                <p>Professionally delivered and installed across Hertfordshire and surrounding counties. Everything is deep cleaned and sanitised before and after every single hire.</p>
              </div>
              <Button asChild variant="link" className="mt-8 p-0 h-auto text-[#B5C2B7] hover:text-[#9EAFA1] uppercase tracking-widest text-xs font-bold">
                <Link href="/about">Read Our Story <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust features */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: ShieldCheck, title: "Fully Insured & Safe", desc: "Public liability insurance. All equipment regularly inspected and baby-safe sanitised." },
              { icon: Sparkles, title: "Luxury Aesthetic", desc: "White, cream and soft grey tones designed to complement any event styling." },
              { icon: HeartHandshake, title: "Stress-Free Service", desc: "We handle delivery, setup and collection — you focus on enjoying the celebration." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }} className="flex flex-col items-start gap-4">
                <div className="w-12 h-12 bg-[#B5C2B7]/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#B5C2B7]" />
                </div>
                <h3 className="font-serif text-lg text-slate-900">{title}</h3>
                <p className="text-slate-500 font-light leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
            <h2 className="text-4xl font-serif text-slate-900 mb-4">Words from our Clients</h2>
            <p className="text-slate-500">Discover why parents trust us with their most special celebrations.</p>
          </motion.div>
          {isLoadingTestimonials ? (
            <div className="bg-white p-10 border border-slate-100"><Skeleton className="w-full h-[200px]" /></div>
          ) : testimonials && testimonials.length > 0 ? (
            <TestimonialsCarousel testimonials={testimonials} />
          ) : null}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-8 text-slate-900">Ready to elevate your next celebration?</h2>
          <p className="text-slate-600 text-lg md:text-xl mb-12 font-light max-w-2xl mx-auto">
            Our diary fills up quickly — especially weekends. Book early to secure your date. We serve Hertfordshire and surrounding areas.
          </p>
          <Button asChild size="lg" className="bg-[#B5C2B7] hover:bg-[#9EAFA1] text-white border-none h-14 px-10 tracking-widest uppercase text-xs">
            <Link href="/contact">Book Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-slate-50 border-b border-slate-100 py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-slate-900 mb-8">Elevating Children's Play</h1>
          <p className="text-xl text-slate-600 font-light leading-relaxed">
            We believe you shouldn't have to compromise on aesthetic when entertaining the little ones. BT Play was born from a desire for beautiful, safe, and thoughtfully designed soft play that complements your event's styling.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="aspect-[4/5] bg-slate-100 relative"
            >
              <img src="/images/gallery-2.png" alt="BT Play aesthetic" className="w-full h-full object-cover" />
            </motion.div>

            <div className="max-w-xl">
              <h2 className="text-3xl font-serif text-slate-900 mb-8">Our Story</h2>
              <div className="space-y-6 text-slate-600 leading-relaxed font-light">
                <p>
                  As parents, we noticed a gap in the market. You spend months planning the perfect birthday celebration — curating the florals, the cake, the venue — only to have brightly coloured plastic equipment clash with your carefully considered vision.
                </p>
                <p>
                  BT Play was created to solve this. We offer premium soft play hire in neutral whites and soft greys — equipment that looks like it belongs in a luxury nursery showroom while still giving toddlers the unbridled joy and physical play they love.
                </p>
                <p>
                  Our setup is simple and transparent: one beautifully styled package covering approximately 20ft of play space — a 10ft² toddler pen and a 10ft² bouncy castle — delivered and collected across Hertfordshire and the surrounding counties.
                </p>
                <p>
                  From the moment you enquire to the moment we collect the equipment, every touchpoint reflects the premium experience that matches our aesthetic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-slate-900 mb-4">Our Commitment</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">The pillars that make a BT Play experience different.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Uncompromising Safety",
                desc: "Beautiful doesn't mean fragile. All our equipment is commercial grade, fully insured, and rigorously checked before every setup. Your little ones are always in safe hands."
              },
              {
                title: "Pristine Hygiene",
                desc: "We use a rigorous cleaning process with baby-safe, eco-friendly sanitisers before and after every single event. Every piece of equipment — including every ball pit ball — is washed thoroughly. No exceptions."
              },
              {
                title: "Stress-Free Service",
                desc: "We handle everything. We arrive early, set up completely, and return to collect at the end — leaving you free to enjoy your celebration without lifting a finger."
              }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center bg-white p-10 border border-slate-100"
              >
                <div className="w-10 h-0.5 bg-[#B5C2B7] mx-auto mb-6" />
                <h3 className="text-xl font-serif text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-500 font-light leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif text-slate-900 mb-6">Service Area</h2>
          <p className="text-slate-600 font-light leading-relaxed max-w-2xl mx-auto mb-4">
            We are based in Hertfordshire and deliver across the county and surrounding areas. Please get in touch with your venue postcode and we'll confirm availability.
          </p>
          <p className="text-sm text-slate-400 uppercase tracking-widest">Hertfordshire · Bedfordshire · Cambridgeshire · Essex · North London</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-50 border-t border-slate-100 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-serif text-slate-900 mb-8">Let's create something beautiful</h2>
          <Button asChild size="lg" className="bg-[#B5C2B7] hover:bg-[#9EAFA1] text-white border-none h-14 px-10 tracking-widest uppercase text-xs">
            <Link href="/contact" data-testid="btn-about-cta">Enquire Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

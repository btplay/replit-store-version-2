import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Faq() {
  const faqs = [
    {
      q: "What ages is soft play suitable for?",
      a: "Our soft play equipment is designed specifically for babies and toddlers up to 4 years old. The equipment provides a safe, stimulating environment for crawling, climbing, and exploring."
    },
    {
      q: "How much space is needed?",
      a: "Our setup is approximately 20ft in total — a 10ft² toddler soft play pen and a 10ft² bouncy castle side by side. You'll need a clear, flat area of at least 20ft × 10ft. We're happy to discuss your venue layout before booking."
    },
    {
      q: "Do you deliver?",
      a: "Yes — delivery, professional setup, and collection are all included in the price. We cover Hertfordshire and the surrounding counties. Please get in touch with your venue postcode and we'll confirm availability."
    },
    {
      q: "How long is the hire period?",
      a: "Our base package is 3 hours, which is ideal for most children's parties. Additional hours are available at £20 per hour — just let us know when you enquire."
    },
    {
      q: "How does pricing work for larger parties?",
      a: "Our base price of £80 covers parties starting from 10 children. Parties of 15 or more children are subject to a £30 supplement, making the price £110 for 3 hours."
    },
    {
      q: "Is everything cleaned and sanitised?",
      a: "Absolutely. Hygiene is a core part of our service. Every piece of equipment, including every ball pit ball, is thoroughly washed and sanitised using baby-safe, eco-friendly products before and after every single hire. No exceptions."
    },
    {
      q: "Can I customise the colours or equipment?",
      a: "We don't offer colour customisation — our equipment comes in our signature white, cream and soft grey aesthetic. This is what gives BT Play its premium, neutral look that photographs beautifully and complements any event styling."
    },
    {
      q: "Do you offer outdoor setups?",
      a: "Yes, weather permitting. The surface must be flat, dry grass or hard standing (no mud, dirt or gravel). We recommend having an indoor backup plan as we cannot set up outdoors if rain is forecast on the day."
    },
    {
      q: "Is a deposit required?",
      a: "Yes, a deposit is required to secure your date. We also hold a refundable damage deposit which is returned promptly after your event, provided all equipment is undamaged. Get in touch to discuss the details."
    },
    {
      q: "Are you fully insured?",
      a: "Yes, BT Play holds comprehensive Public Liability Insurance. We can provide a copy of our certificate to your venue upon request."
    }
  ];

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="bg-slate-50 border-b border-slate-100 py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-serif text-slate-900 mb-6">Frequently Asked Questions</h1>
          <p className="text-lg text-slate-500 font-light">Everything you need to know about hiring with BT Play.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="bg-white border border-slate-100 shadow-sm">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <AccordionItem value={`item-${i}`} className="border-b border-slate-100 last:border-0 px-8">
                  <AccordionTrigger className="text-left font-medium text-slate-800 hover:text-[#B5C2B7] hover:no-underline text-base py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 font-light leading-relaxed pb-6 text-base">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-500 mb-6">Still have a question? We'd love to hear from you.</p>
          <Button asChild className="h-12 px-8 bg-[#B5C2B7] hover:bg-[#9EAFA1] text-white tracking-widest uppercase text-xs border-none">
            <Link href="/contact" data-testid="btn-faq-contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

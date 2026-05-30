import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: number;
  customerName: string;
  eventType: string;
  quote: string;
  rating: number;
  location?: string | null;
}

interface Props {
  testimonials: Testimonial[];
}

export function TestimonialsCarousel({ testimonials }: Props) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const total = testimonials.length;

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, total]);

  if (!total) return null;

  const testimonial = testimonials[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="relative">
      {/* Main card */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white p-10 md:p-14 border border-slate-100 min-h-[280px] flex flex-col justify-between"
          >
            <div>
              <div className="flex text-[#D9C5B2] mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 text-xl md:text-2xl leading-relaxed font-serif italic mb-8">
                "{testimonial.quote}"
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm uppercase tracking-wider">{testimonial.customerName}</p>
              <p className="text-slate-500 text-sm mt-1">
                {testimonial.eventType}{testimonial.location && ` • ${testimonial.location}`}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`transition-all duration-300 rounded-full ${i === current ? "w-6 h-2 bg-[#B5C2B7]" : "w-2 h-2 bg-slate-200 hover:bg-slate-300"}`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={prev} className="p-2 border border-slate-200 hover:border-[#B5C2B7] hover:text-[#B5C2B7] transition-colors" aria-label="Previous">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={next} className="p-2 border border-slate-200 hover:border-[#B5C2B7] hover:text-[#B5C2B7] transition-colors" aria-label="Next">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

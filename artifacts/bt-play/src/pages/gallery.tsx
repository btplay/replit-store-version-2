import { useState } from "react";
import { motion } from "framer-motion";

export default function Gallery() {
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Birthdays", "Indoor", "Outdoor", "Neutral themes"];

  const images = [
    { src: "/images/hero.png", category: "Birthdays", theme: "Neutral themes" },
    { src: "/images/gallery-1.png", category: "Indoor", theme: "Neutral themes" },
    { src: "/images/gallery-2.png", category: "Birthdays", theme: "Neutral themes" },
    { src: "/images/gallery-3.png", category: "Indoor", theme: "Neutral themes" },
  ];

  const filteredImages = filter === "All"
    ? images
    : images.filter(img => img.category === filter || img.theme === filter);

  return (
    <div className="w-full bg-white pb-32">
      <div className="py-24 max-w-4xl mx-auto text-center px-6">
        <h1 className="text-5xl md:text-6xl font-serif text-slate-900 mb-6">Our Portfolio</h1>
        <p className="text-lg text-slate-500 font-light mb-12">Browse our previous setups and see how BT Play can bring a premium play experience to your celebration.</p>

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              data-testid={`filter-${cat.toLowerCase().replace(/\s/g, "-")}`}
              className={`px-5 py-2 text-xs uppercase tracking-widest transition-colors ${
                filter === cat
                  ? 'bg-[#B5C2B7] text-white'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((img, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              key={`${img.src}-${i}`}
              className="relative group overflow-hidden break-inside-avoid bg-slate-50"
            >
              <img
                src={img.src}
                alt={`${img.category} soft play setup`}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-slate-800 text-xs uppercase tracking-widest font-bold bg-white/80 px-3 py-1">{img.category}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredImages.length === 0 && (
          <div className="text-center py-24 text-slate-500 font-light">
            No images found for this category.
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";

// --- 3D TILT CARD COMPONENT WITH DYNAMIC SPECULAR LIGHT GLARE ---
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [transform, setTransform] = useState("");
  const [glare, setGlare] = useState({ opacity: 0, x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    );
    setGlare({
      opacity: 0.35,
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlare({ opacity: 0, x: 50, y: 50 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transform || undefined,
        transformStyle: "preserve-3d",
        transition: "transform 0.15s ease-out",
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      {/* 3D Dynamic Specular Light Glare */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle 350px at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.45), transparent 70%)`,
        }}
      />
    </div>
  );
}

// Type for bag / cart items
type CartItem = {
  id: string;
  name: string;
  size: "40ml" | "125ml" | "250ml";
  price: string;
  numericPrice: number;
  engraving?: string;
  image: string;
};

export default function Home() {
  // --- INTERACTIVE STATE ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<"40ml" | "125ml" | "250ml">("125ml");
  const [heroImage, setHeroImage] = useState<string>("/hero-luxury-amber.jpg");
  const [giftingImage, setGiftingImage] = useState<string>("/gift-luxury.jpg");
  const [showToast, setShowToast] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("ingredients");

  // FEATURE 1: Live Bottle Engraving State
  const [engravingText, setEngravingText] = useState("C. DIOR");
  const [isEngravingActive, setIsEngravingActive] = useState(true);

  // FEATURE 2: Slide-Out Bag Drawer & Miniature Samples State
  const [isBagDrawerOpen, setIsBagDrawerOpen] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "cart-item-1",
      name: "Gris Dior Esprit de Parfum",
      size: "125ml",
      price: "€350",
      numericPrice: 350,
      engraving: "C. DIOR",
      image: "/hero-luxury-amber.jpg",
    },
  ]);
  const [selectedSamples, setSelectedSamples] = useState<string[]>([
    "Ambre Nuit (7.5ml)",
    "Oud Ispahan (7.5ml)",
  ]);

  // FEATURE 3: Scent Discovery Quiz State
  const [quizStep, setQuizStep] = useState<1 | 2 | 3>(1);
  const [quizMood, setQuizMood] = useState<"chypre" | "amber" | "oud" | "marine" | null>("chypre");
  const [quizOccasion, setQuizOccasion] = useState<"daily" | "evening" | "coastal" | null>("daily");

  // Format pricing and detail mapping
  const sizeDetails = {
    "40ml": {
      name: "The Travel Flacon",
      volume: "40 ml • 1.4 FL. OZ",
      price: "€165",
      numericPrice: 165,
      wear: "Approx. 2–3 months of daily wear",
      badge: "Discovery Size",
    },
    "125ml": {
      name: "The Iconic Flacon",
      volume: "125 ml • 4.2 FL. OZ",
      price: "€350",
      numericPrice: 350,
      wear: "Approx. 8–10 months of daily wear",
      badge: "Most Coveted",
    },
    "250ml": {
      name: "The Connoisseur Flacon",
      volume: "250 ml • 8.4 FL. OZ",
      price: "€490",
      numericPrice: 490,
      wear: "Over 16+ months of daily wear",
      badge: "Flacon de Prestige",
    },
  };

  const handleAddToBag = (customSize?: "40ml" | "125ml" | "250ml", customName?: string, customImage?: string) => {
    const sizeToUse = customSize || selectedSize;
    const newItem: CartItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      name: customName || "Gris Dior Esprit de Parfum",
      size: sizeToUse,
      price: sizeDetails[sizeToUse].price,
      numericPrice: sizeDetails[sizeToUse].numericPrice,
      engraving: isEngravingActive && engravingText.trim() ? engravingText.trim().toUpperCase() : undefined,
      image: customImage || heroImage,
    };
    setCartItems((prev) => [...prev, newItem]);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  const removeFromBag = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleSample = (sample: string) => {
    if (selectedSamples.includes(sample)) {
      setSelectedSamples(selectedSamples.filter((s) => s !== sample));
    } else if (selectedSamples.length < 2) {
      setSelectedSamples([...selectedSamples, sample]);
    }
  };

  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.numericPrice, 0);

  const toggleAccordion = (key: string) => {
    setActiveAccordion(activeAccordion === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1a17] font-sans flex flex-col selection:bg-stone-800 selection:text-white">
      {/* --- ADDED TO BAG TOAST NOTIFICATION --- */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#141414] text-white px-6 py-4 rounded-xl shadow-2xl border border-stone-700 flex items-center gap-4 transition-all duration-300 animate-bounce">
          <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-emerald-400 font-bold text-sm">
            &check;
          </div>
          <div>
            <div className="text-xs font-serif tracking-wider uppercase font-semibold">
              Added to Your Dior Bag
            </div>
            <div className="text-[11px] text-stone-400 font-light">
              Gris Dior ({sizeDetails[selectedSize].volume}) &bull; {sizeDetails[selectedSize].price}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowToast(false);
              setIsBagDrawerOpen(true);
            }}
            className="ml-2 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-amber-300 text-[10px] uppercase tracking-wider rounded font-medium transition-colors border border-amber-400/30"
          >
            Open Bag &rarr;
          </button>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="text-stone-400 hover:text-white text-sm"
          >
            &times;
          </button>
        </div>
      )}

      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#141414] text-[#e8e6e3] text-[11px] tracking-[0.2em] uppercase py-2.5 px-4 text-center font-medium">
        Complimentary Iconic Dior Packaging &bull; 2 Miniature Samples With Every Order
      </div>

      {/* 2. HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#e5dfd5]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Left Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-[11px] tracking-[0.18em] uppercase font-medium text-stone-700">
            <a href="#fragrances" className="hover:text-black transition-colors">
              Fragrances
            </a>
            <a href="#quiz" className="hover:text-black transition-colors text-stone-900 font-semibold underline decoration-amber-500/60 underline-offset-4">
              Scent Finder
            </a>
            <a href="#notes" className="hover:text-black transition-colors">
              The Notes
            </a>
            <a href="#collection" className="hover:text-black transition-colors">
              Flacon Formats
            </a>
            <a href="#ritual" className="hover:text-black transition-colors">
              The Ritual
            </a>
            <a href="#gifting" className="hover:text-black transition-colors">
              Art of Gifting
            </a>
            <a href="#atelier" className="hover:text-black transition-colors">
              The Atelier
            </a>
          </nav>

          {/* Left Hamburger Button (Mobile Only) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-stone-800 hover:text-black transition-colors"
            aria-label="Open mobile navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          {/* Center Brand Logo */}
          <div className="text-center">
            <a
              href="/"
              className="text-2xl md:text-3xl font-serif tracking-[0.35em] uppercase font-bold text-black"
            >
              DIOR
            </a>
            <span className="block text-[9px] tracking-[0.3em] uppercase text-stone-500 font-sans -mt-0.5">
              Parfums Paris
            </span>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-6 text-[11px] tracking-[0.18em] uppercase font-medium text-stone-700">
            <a
              href="#reviews"
              className="hidden sm:inline-block hover:text-black transition-colors"
            >
              Reviews (4.9★)
            </a>
            <a
              href="#details"
              className="hidden sm:inline-block hover:text-black transition-colors"
            >
              Concierge
            </a>
            <button
              type="button"
              onClick={() => setIsBagDrawerOpen(true)}
              className="flex items-center gap-1.5 hover:text-black transition-colors font-semibold"
            >
              <span>Bag</span>
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center font-mono">
                {cartItems.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION SLIDE-OUT DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Dimmed Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <aside className="fixed inset-y-0 right-0 w-full sm:max-w-sm bg-[#141414] text-[#ede8e1] shadow-2xl p-8 flex flex-col justify-between z-50">
            <div>
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-8 border-b border-stone-800">
                <div>
                  <span className="text-xl font-serif tracking-[0.3em] font-bold text-white block">
                    DIOR
                  </span>
                  <span className="text-[9px] tracking-[0.25em] uppercase text-stone-400 block -mt-1 font-sans">
                    Menu Privé
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-stone-400 hover:text-white transition-colors"
                  aria-label="Close navigation menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-8 flex flex-col space-y-5">
                <a
                  href="#hero"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-baseline justify-between text-base font-serif tracking-wider text-stone-200 hover:text-white transition-colors"
                >
                  <span>01 &bull; Gris Dior</span>
                  <span className="text-xs font-sans tracking-widest text-stone-500 group-hover:text-stone-300">&rarr;</span>
                </a>
                <a
                  href="#notes"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-baseline justify-between text-base font-serif tracking-wider text-stone-200 hover:text-white transition-colors"
                >
                  <span>02 &bull; Olfactory Pyramid</span>
                  <span className="text-xs font-sans tracking-widest text-stone-500 group-hover:text-stone-300">&rarr;</span>
                </a>
                <a
                  href="#collection"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-baseline justify-between text-base font-serif tracking-wider text-stone-200 hover:text-white transition-colors"
                >
                  <span>03 &bull; Flacon Formats</span>
                  <span className="text-xs font-sans tracking-widest text-stone-500 group-hover:text-stone-300">&rarr;</span>
                </a>
                <a
                  href="#fragrances"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-baseline justify-between text-base font-serif tracking-wider text-stone-200 hover:text-white transition-colors"
                >
                  <span>04 &bull; The Wardrobe</span>
                  <span className="text-xs font-sans tracking-widest text-stone-500 group-hover:text-stone-300">&rarr;</span>
                </a>
                <a
                  href="#ritual"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-baseline justify-between text-base font-serif tracking-wider text-stone-200 hover:text-white transition-colors"
                >
                  <span>05 &bull; The Application Ritual</span>
                  <span className="text-xs font-sans tracking-widest text-stone-500 group-hover:text-stone-300">&rarr;</span>
                </a>
                <a
                  href="#gifting"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-baseline justify-between text-base font-serif tracking-wider text-stone-200 hover:text-white transition-colors"
                >
                  <span>06 &bull; The Art of Gifting</span>
                  <span className="text-xs font-sans tracking-widest text-stone-500 group-hover:text-stone-300">&rarr;</span>
                </a>
                <a
                  href="#atelier"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-baseline justify-between text-base font-serif tracking-wider text-stone-200 hover:text-white transition-colors"
                >
                  <span>07 &bull; The Grasse Atelier</span>
                  <span className="text-xs font-sans tracking-widest text-stone-500 group-hover:text-stone-300">&rarr;</span>
                </a>
                <a
                  href="#reviews"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-baseline justify-between text-base font-serif tracking-wider text-stone-200 hover:text-white transition-colors"
                >
                  <span>08 &bull; Press &amp; Reviews</span>
                  <span className="text-xs font-sans tracking-widest text-stone-500 group-hover:text-stone-300">&rarr;</span>
                </a>
              </nav>
            </div>

            {/* Drawer Bottom Details */}
            <div className="pt-8 border-t border-stone-800/80 space-y-4">
              <div className="text-[11px] text-stone-400 space-y-1">
                <span className="block text-[10px] uppercase tracking-widest text-stone-500">Maison Concierge</span>
                <span className="font-mono text-stone-300">+33 (0)1 40 73 73 73</span>
              </div>
              <div className="flex items-center justify-between text-[10px] tracking-widest uppercase text-stone-500 pt-2">
                <span>France &bull; EUR (€)</span>
                <span>Atelier Grasse</span>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* FEATURE 2: SLIDE-OUT DIOR SHOPPING BAG DRAWER */}
      {isBagDrawerOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsBagDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Body */}
          <aside className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-[#faf8f5] text-[#1c1a17] shadow-2xl flex flex-col justify-between z-50 border-l border-stone-300 animate-in slide-in-from-right duration-300">
            {/* Drawer Top Header */}
            <div className="p-6 border-b border-stone-200 bg-white/70 backdrop-blur-sm flex items-center justify-between">
              <div>
                <span className="text-lg font-serif tracking-[0.2em] uppercase font-bold text-stone-900 block">
                  Votre Panier Dior
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-stone-500 font-sans block">
                  {cartItems.length} {cartItems.length === 1 ? "Creation" : "Creations"} &bull; Complimentary Packaging
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsBagDrawerOpen(false)}
                className="p-2 text-stone-500 hover:text-black transition-colors"
                aria-label="Close Dior bag drawer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Cart Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Climate-Neutral Express Shipping Banner */}
              <div className="bg-stone-900 text-stone-100 p-3.5 rounded-xl text-xs flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-stone-800 text-amber-300 flex items-center justify-center shrink-0 font-serif text-xs">
                  ✦
                </span>
                <div>
                  <div className="font-medium tracking-wider uppercase text-[11px]">
                    Complimentary Express Delivery Unlocked
                  </div>
                  <div className="text-[10px] text-stone-400 font-light">
                    Hand-packaged at 30 Avenue Montaigne, Paris with wax seal.
                  </div>
                </div>
              </div>

              {/* Items in Bag */}
              {cartItems.length === 0 ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-stone-200 mx-auto flex items-center justify-center text-stone-400 text-2xl font-serif">
                    Ø
                  </div>
                  <h4 className="text-base font-serif text-stone-800">Your Bag is Empty</h4>
                  <p className="text-xs text-stone-500 font-light max-w-xs mx-auto">
                    Explore our Haute Parfumerie collection and experience Christian Dior&apos;s most coveted fragrances.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBagDrawerOpen(false);
                      handleAddToBag();
                    }}
                    className="px-6 py-2.5 bg-stone-900 text-white text-[11px] uppercase tracking-widest font-semibold rounded"
                  >
                    Add Gris Dior (125ml)
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold block">
                    Your Selection:
                  </span>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-stone-200/90 rounded-xl p-4 flex gap-4 shadow-xs"
                    >
                      <div className="relative w-16 h-20 bg-stone-100 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-serif font-medium text-stone-900 leading-tight">
                              {item.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeFromBag(item.id)}
                              className="text-stone-400 hover:text-stone-700 text-xs ml-2"
                              title="Remove item"
                            >
                              &times;
                            </button>
                          </div>
                          <span className="text-[11px] text-stone-500 uppercase tracking-wider font-mono block mt-0.5">
                            Format {item.size}
                          </span>

                          {/* Live Engraving Tag */}
                          {item.engraving && (
                            <div className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 rounded text-[10px] font-mono">
                              <span>✨ Laser-Etched:</span>
                              <span className="font-serif font-bold tracking-widest">
                                &ldquo;{item.engraving}&rdquo;
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-2">
                          <span className="text-[10px] text-emerald-700 font-medium">In Stock &bull; Paris Atelier</span>
                          <span className="font-mono text-sm font-bold text-stone-900">{item.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* FEATURE 2: 2 COMPLIMENTARY MINIATURE SAMPLES SELECTOR */}
              <div className="bg-white border border-stone-200/90 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-serif font-semibold text-stone-900 block">
                      Les Miniatures d&apos;Exception (7.5 ml)
                    </span>
                    <span className="text-[10px] text-stone-500 font-light block">
                      Select up to 2 complimentary miniatures to test before opening.
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-stone-100 border border-stone-200 rounded font-semibold text-stone-700">
                    {selectedSamples.length}/2 Selected
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    { id: "Ambre Nuit (7.5ml)", notes: "Amber & Turkish Rose" },
                    { id: "Oud Ispahan (7.5ml)", notes: "Smoked Oud & Rose" },
                    { id: "Eden-Roc (7.5ml)", notes: "Sea Salt & Pine" },
                    { id: "Bois Talisman (7.5ml)", notes: "Iris & Cedarwood" },
                  ].map((sample) => {
                    const isSelected = selectedSamples.includes(sample.id);
                    return (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => toggleSample(sample.id)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          isSelected
                            ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                            : "bg-[#faf8f5] text-stone-700 border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-medium leading-tight">
                          <span>{sample.id}</span>
                          <span>{isSelected ? "✓" : "+"}</span>
                        </div>
                        <span className={`text-[9px] block mt-0.5 font-light ${isSelected ? "text-stone-300" : "text-stone-500"}`}>
                          {sample.notes}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Complimentary Gifting Reassurance */}
              <div className="p-3 bg-[#f2ece2] rounded-xl border border-stone-300/80 flex items-center gap-3 text-xs text-stone-700">
                <span className="text-base">🎁</span>
                <span className="text-[11px] leading-tight font-light">
                  Wrapped in signature Christian Dior white and gold textured box with embossed seal &bull; <strong>Always 0€</strong>
                </span>
              </div>
            </div>

            {/* Drawer Bottom Checkout Summary */}
            <div className="p-6 border-t border-stone-200 bg-white space-y-4">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-stone-900 font-medium">€{cartSubtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Haute Packaging &amp; 2 Samples:</span>
                  <span className="font-mono text-emerald-700 font-semibold">Complimentary</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Climate Express Delivery:</span>
                  <span className="font-mono text-emerald-700 font-semibold">Complimentary</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-sm font-semibold text-stone-900">
                  <span>Estimated Total:</span>
                  <span className="font-mono text-base">€{cartSubtotal}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={cartItems.length === 0}
                onClick={() => {
                  setIsBagDrawerOpen(false);
                  setIsCheckoutSuccess(true);
                }}
                className={`w-full py-4 text-xs uppercase tracking-[0.25em] font-semibold transition-all shadow-md active:scale-[0.98] ${
                  cartItems.length > 0
                    ? "bg-[#141414] hover:bg-stone-800 text-white cursor-pointer"
                    : "bg-stone-300 text-stone-500 cursor-not-allowed"
                }`}
              >
                Proceed to Dior Checkout &bull; €{cartSubtotal}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ORDER CONFIRMATION MODAL */}
      {isCheckoutSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setIsCheckoutSuccess(false)}
          />
          <div className="relative bg-[#faf8f5] border border-stone-300 rounded-3xl p-8 sm:p-10 max-w-lg w-full text-center space-y-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-stone-900 text-amber-300 mx-auto flex items-center justify-center text-2xl font-serif border border-amber-400/40">
              CD
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-medium block">
                Maison Christian Dior &bull; Commande Confirmée
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-stone-900">
                Merci Pour Votre Commande
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Your bespoke creation is currently being hand-blended and sealed with wax at our Grasse atelier.
              </p>
            </div>

            {/* Order Details Badge */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 text-left text-xs space-y-2 text-stone-700">
              <div className="flex justify-between border-b border-stone-100 pb-1.5 font-mono text-[11px]">
                <span className="text-stone-400">Order Reference:</span>
                <span className="font-bold text-stone-900">#CD-2026-GRIS-{Math.floor(1000 + Math.random() * 9000)}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-1.5">
                <span className="text-stone-500">Selected Creation:</span>
                <span className="font-serif font-medium">{cartItems[0]?.name || "Gris Dior"} ({selectedSize})</span>
              </div>
              {isEngravingActive && engravingText && (
                <div className="flex justify-between border-b border-stone-100 pb-1.5">
                  <span className="text-stone-500">Laser Engraving:</span>
                  <span className="font-mono text-amber-700 font-semibold">&ldquo;{engravingText}&rdquo;</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-stone-500">Complimentary Samples:</span>
                <span className="text-[11px] text-stone-800">{selectedSamples.join(", ") || "None"}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCheckoutSuccess(false)}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs uppercase tracking-[0.2em] font-medium rounded-xl transition-all"
            >
              Return to Haute Parfumerie
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col justify-center">
        {/* 3. HERO SECTION */}
        <section id="hero" className="max-w-7xl mx-auto px-6 py-12 lg:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
            {/* Left Column: Fragrance Story & Call To Actions */}
            <div className="lg:col-span-6 flex flex-col items-start space-y-6">
              {/* Eyebrow / Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-stone-200/60 border border-stone-300 rounded-full text-[11px] tracking-[0.2em] uppercase text-stone-700">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-800"></span>
                La Collection Privée Christian Dior
              </div>

              {/* Main Fragrance Title */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-[0.08em] font-light text-stone-900 leading-[1.15]">
                  GRIS DIOR
                </h1>
                <p className="text-sm uppercase tracking-[0.25em] text-stone-500 font-medium">
                  Esprit de Parfum &bull; Floral Chypre
                </p>
              </div>

              {/* Editorial Description */}
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-light max-w-xl">
                A subtle union of citrus vibrance, intense floral heart notes of
                Damascena rose, and an amber moss backdrop. Gris Dior is an icon
                of bold elegance, crafted for connoisseurs of timeless Haute
                Parfumerie.
              </p>

              {/* Live Size & Price Preview Pills */}
              <div className="space-y-2 w-full max-w-md">
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold block">
                  Select Format:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(["40ml", "125ml", "250ml"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 text-xs tracking-wider uppercase font-medium rounded-lg border transition-all text-center ${
                        selectedSize === size
                          ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                          : "bg-white text-stone-700 border-stone-300 hover:border-stone-500"
                      }`}
                    >
                      <div>{size}</div>
                      <div className="text-[10px] font-mono opacity-80 mt-0.5">
                        {sizeDetails[size].price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* FEATURE 1: Bespoke Flacon Engraving Personalizer */}
              <div className="w-full max-w-md bg-stone-100/90 border border-stone-300/80 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase tracking-wider text-stone-800 font-semibold flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Complimentary Bottle Engraving
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-mono text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full font-semibold">
                      Included
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEngravingActive(!isEngravingActive)}
                    className="text-[10px] uppercase tracking-wider text-stone-500 hover:text-black font-medium underline"
                  >
                    {isEngravingActive ? "Disable" : "+ Enable"}
                  </button>
                </div>

                {isEngravingActive && (
                  <div className="space-y-1.5 pt-1">
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={18}
                        value={engravingText}
                        onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                        placeholder="ENTER INITIALS OR NAME (MAX 18 CHARS)"
                        className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-serif tracking-[0.25em] text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-stone-800 uppercase"
                      />
                      {engravingText && (
                        <button
                          type="button"
                          onClick={() => setEngravingText("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-stone-500 font-light">
                      <span>Laser-etched into the crystal in Dior gold leaf.</span>
                      <span className="font-mono text-stone-600 font-medium">{engravingText.length}/18</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Key Fragrance Highlights / Badges */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-lg pt-2 pb-2 border-y border-stone-200">
                <div className="text-left">
                  <span className="block text-[10px] uppercase tracking-wider text-stone-400">
                    Character
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-stone-800">
                    Woody &amp; Floral
                  </span>
                </div>
                <div className="text-left border-l border-stone-200 pl-3">
                  <span className="block text-[10px] uppercase tracking-wider text-stone-400">
                    Intensity
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-stone-800">
                    Refined &bull;&bull;&bull;&bull;&bull;
                  </span>
                </div>
                <div className="text-left border-l border-stone-200 pl-3">
                  <span className="block text-[10px] uppercase tracking-wider text-stone-400">
                    Heritage
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-stone-800">
                    Grasse, France
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
                <button
                  type="button"
                  onClick={() => handleAddToBag()}
                  className="px-8 py-4 bg-[#141414] hover:bg-stone-800 active:scale-[0.98] text-white text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-200 text-center shadow-md flex items-center justify-center gap-3"
                >
                  <span>Add to Bag</span>
                  <span>&bull;</span>
                  <span className="font-mono">{sizeDetails[selectedSize].price}</span>
                </button>
                <a
                  href="#quiz"
                  className="px-8 py-4 border border-stone-400 hover:border-black active:scale-[0.98] text-stone-800 hover:text-black text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-200 text-center bg-transparent"
                >
                  Scent Finder Quiz
                </a>
              </div>

              {/* Quality Guarantee Note */}
              <p className="text-[11px] tracking-wider text-stone-400 uppercase pt-1">
                Complimentary custom engraving &bull; 2 Miniature samples with your discovery.
              </p>
            </div>

            {/* Right Column: 3D Interactive Showcase with Ultra-HD Luxury Flacon */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center w-full">
              <TiltCard className="w-full max-w-md aspect-[4/5] rounded-3xl border border-stone-200/90 shadow-2xl bg-white group cursor-pointer relative">
                <Image
                  src={heroImage}
                  alt="Gris Dior Haute Parfumerie Flacon d'Exception"
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 500px"
                />

                {/* Subtle luxury vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>

                {/* FEATURE 1: 3D Live Gold Laser-Etched Engraving on Bottle */}
                {isEngravingActive && engravingText && (
                  <div
                    style={{ transform: "translateZ(45px)" }}
                    className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 text-center transition-all duration-300 w-3/4"
                  >
                    <div className="py-2 px-3 bg-black/40 backdrop-blur-xs border border-amber-300/40 rounded shadow-2xl">
                      <span className="block text-[8px] uppercase tracking-[0.3em] text-amber-200/80 font-mono">
                        Gravure Sur-Mesure
                      </span>
                      <span className="text-base sm:text-xl font-serif tracking-[0.3em] text-amber-300 font-bold drop-shadow-[0_2px_10px_rgba(251,191,36,0.6)]">
                        {engravingText}
                      </span>
                    </div>
                  </div>
                )}

                {/* 3D Floating Glass Plaque (Hover mouse to see it float in 3D!) */}
                <div
                  style={{ transform: "translateZ(35px)" }}
                  className="absolute bottom-6 inset-x-6 bg-white/95 backdrop-blur-md border border-stone-200/90 p-4 rounded-2xl shadow-xl flex items-center justify-between z-10 transition-transform"
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold block">
                      Haute Parfumerie &bull; Grasse
                    </span>
                    <span className="text-sm font-serif font-medium text-stone-900">
                      Gris Dior &bull; Flacon d&apos;Exception
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
                    {sizeDetails[selectedSize].price}
                  </span>
                </div>
              </TiltCard>

              {/* Interactive 3D Perspective Angles */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mr-1">
                  HD Angle:
                </span>
                {[
                  { path: "/hero-luxury-amber.jpg", label: "Amber Crystal" },
                  { path: "/hero-luxury-hd.jpg", label: "Architectural Studio" },
                  { path: "/hero-luxury-chanel.jpg", label: "Studio Noir" },
                ].map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => setHeroImage(item.path)}
                    className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-full transition-all ${
                      heroImage === item.path
                        ? "bg-stone-900 text-white font-medium shadow-xs"
                        : "bg-white/80 border border-stone-300 text-stone-600 hover:border-stone-500"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. OLFACTORY NOTES & SCENT PYRAMID SECTION */}
        <section id="notes" className="bg-[#f2ece2] border-t border-b border-[#e2d9cd] py-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
              <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-medium block">
                L&apos;Architecture Olfactive
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light tracking-wide text-stone-900">
                The Olfactory Pyramid
              </h2>
              <div className="w-12 h-px bg-stone-400 mx-auto mt-4"></div>
              <p className="text-stone-600 font-light text-base leading-relaxed pt-2">
                Like an exquisite piece of haute couture, Gris Dior unfolds in three harmonious
                phases, shifting gracefully from sparkling citrus to a deep woody-floral signature.
              </p>
            </div>

            {/* Notes Pyramid Cards (Responsive 3-Column Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Note 1: Top Notes */}
              <div className="bg-[#faf8f5] p-8 border border-stone-300/80 rounded-xl shadow-xs flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-stone-400">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-stone-400">
                      Phase 01 &bull; 0–15 Min
                    </span>
                    <span className="px-2 py-0.5 bg-stone-200/80 rounded text-[9px] uppercase tracking-wider text-stone-700 font-semibold">
                      Opening
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-stone-500 font-medium block">
                      Notes de Tête
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif text-stone-900 mt-1">
                      Calabrian Bergamot
                    </h3>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed font-light">
                    A vibrant, luminous citrus burst harvested from sun-drenched Italian groves.
                    It delivers an immediate effervescence and lively zest upon first spray.
                  </p>
                </div>

                {/* Ingredient Badges */}
                <div className="pt-4 border-t border-stone-200">
                  <span className="block text-[9px] uppercase tracking-[0.15em] text-stone-400 mb-2">
                    Key Ingredients
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 bg-[#ede6da] rounded-full text-[11px] text-stone-800">
                      Bergamot
                    </span>
                    <span className="px-2.5 py-1 bg-[#ede6da] rounded-full text-[11px] text-stone-800">
                      Mandarin Zest
                    </span>
                    <span className="px-2.5 py-1 bg-[#ede6da] rounded-full text-[11px] text-stone-800">
                      Grapefruit
                    </span>
                  </div>
                </div>
              </div>

              {/* Note 2: Heart Notes */}
              <div className="bg-[#faf8f5] p-8 border border-stone-300/80 rounded-xl shadow-xs flex flex-col justify-between space-y-6 relative transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-stone-400">
                {/* Visual Accent Badge for Core note */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-stone-900 text-white text-[9px] tracking-[0.2em] uppercase font-medium rounded-full">
                  Heart of the Scent
                </div>

                <div className="space-y-4 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-stone-400">
                      Phase 02 &bull; 15m–4 Hours
                    </span>
                    <span className="px-2 py-0.5 bg-stone-200/80 rounded text-[9px] uppercase tracking-wider text-stone-700 font-semibold">
                      Bloom
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-stone-500 font-medium block">
                      Notes de Cœur
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif text-stone-900 mt-1">
                      Damascena Rose
                    </h3>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed font-light">
                    A voluptuous and velvety floral heart hand-plucked in Grasse. It lends a radiant,
                    noble sweetness that balances the woody crispness of the fragrance.
                  </p>
                </div>

                {/* Ingredient Badges */}
                <div className="pt-4 border-t border-stone-200">
                  <span className="block text-[9px] uppercase tracking-[0.15em] text-stone-400 mb-2">
                    Key Ingredients
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 bg-[#ede6da] rounded-full text-[11px] text-stone-800">
                      Grasse Rose
                    </span>
                    <span className="px-2.5 py-1 bg-[#ede6da] rounded-full text-[11px] text-stone-800">
                      Sambac Jasmine
                    </span>
                    <span className="px-2.5 py-1 bg-[#ede6da] rounded-full text-[11px] text-stone-800">
                      Violet Leaf
                    </span>
                  </div>
                </div>
              </div>

              {/* Note 3: Base Notes */}
              <div className="bg-[#faf8f5] p-8 border border-stone-300/80 rounded-xl shadow-xs flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-stone-400">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-stone-400">
                      Phase 03 &bull; 4–12+ Hours
                    </span>
                    <span className="px-2 py-0.5 bg-stone-200/80 rounded text-[9px] uppercase tracking-wider text-stone-700 font-semibold">
                      Trail / Sillage
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-stone-500 font-medium block">
                      Notes de Fond
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif text-stone-900 mt-1">
                      Oakmoss &amp; Patchouli
                    </h3>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed font-light">
                    The profound chypre foundation. Earthy undergrowth moss meets warm Indonesian
                    patchouli and amber, leaving an unmistakable trail on skin and fabric.
                  </p>
                </div>

                {/* Ingredient Badges */}
                <div className="pt-4 border-t border-stone-200">
                  <span className="block text-[9px] uppercase tracking-[0.15em] text-stone-400 mb-2">
                    Key Ingredients
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 bg-[#ede6da] rounded-full text-[11px] text-stone-800">
                      Undergrowth Moss
                    </span>
                    <span className="px-2.5 py-1 bg-[#ede6da] rounded-full text-[11px] text-stone-800">
                      Patchouli
                    </span>
                    <span className="px-2.5 py-1 bg-[#ede6da] rounded-full text-[11px] text-stone-800">
                      Amber Accord
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Perfumer Quote Banner */}
            <div className="mt-16 bg-[#faf8f5] border border-stone-300/70 p-8 sm:p-10 rounded-2xl text-center max-w-3xl mx-auto space-y-3">
              <span className="text-2xl font-serif text-stone-400 select-none block">&ldquo;</span>
              <p className="text-stone-700 font-serif italic text-lg sm:text-xl leading-relaxed -mt-3">
                Grey is not merely a blend of black and white; it is the nuanced canvas of the House of Dior.
                In Gris Dior, we captured that mystery in an amber chypre accord that lingers endlessly.
              </p>
              <div className="pt-2">
                <span className="text-xs uppercase tracking-[0.2em] font-medium text-stone-800 block">
                  Dior Parfumeur-Créateur
                </span>
                <span className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-light block">
                  Grasse Atelier &bull; France
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. PRODUCT HIGHLIGHTS & BOTTLE SIZES SECTION */}
        <section id="collection" className="py-20 px-6 max-w-7xl mx-auto w-full">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
            <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-medium block">
              Formats &bull; Flacons d&apos;Exception
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light tracking-wide text-stone-900">
              The Dior Couture Flacons
            </h2>
            <div className="w-12 h-px bg-stone-400 mx-auto mt-4"></div>
            <p className="text-stone-600 font-light text-base leading-relaxed pt-2">
              Every bottle of Gris Dior is crowned with iconic couture caps inspired
              by Christian Dior fabrics: Houndstooth, Cannage, and Dior Oblique canvas.
            </p>
          </div>

          {/* 3D Couture Flacons Showcase Stage (Featuring Second Pic) */}
          <div className="mb-20">
            <TiltCard className="w-full max-w-4xl mx-auto aspect-[16/11] sm:aspect-[16/10] rounded-3xl border border-stone-200 shadow-2xl bg-white group cursor-pointer">
              <Image
                src="/flacons-couture.jpg"
                alt="Christian Dior Couture Flacons Lineup with Designer Caps"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 900px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none"></div>

              {/* 3D Floating Plaque on the Flacons Image */}
              <div
                style={{ transform: "translateZ(35px)" }}
                className="absolute bottom-6 inset-x-6 sm:inset-x-10 bg-white/95 backdrop-blur-md border border-stone-200/90 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 transition-transform"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold block">
                    Bouchons Couture &bull; Les Créations d&apos;Exception
                  </span>
                  <span className="text-base sm:text-lg font-serif font-medium text-stone-900">
                    Gris Dior &bull; Flacon d&apos;Atelier avec Bouchon Personnalisable
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddToBag()}
                  className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-xl transition-all active:scale-[0.98] shrink-0 text-center shadow-md"
                >
                  Add {selectedSize} to Bag &bull; {sizeDetails[selectedSize].price}
                </button>
              </div>
            </TiltCard>
          </div>

          {/* 3 Bottle Size Cards with 3D Tilt & Ultra-HD Photography */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {/* Format 1: 40 ml */}
            <TiltCard
              className={`bg-white rounded-2xl cursor-pointer transition-all duration-300 shadow-xs hover:shadow-xl group ${
                selectedSize === "40ml"
                  ? "border-2 border-stone-900 ring-2 ring-stone-900/10 shadow-md"
                  : "border border-stone-200/90 hover:border-stone-400"
              }`}
            >
              <div
                onClick={() => setSelectedSize("40ml")}
                className="p-8 h-full flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-[11px] tracking-wider uppercase text-stone-500">
                    <span>Discovery Size</span>
                    <span className="font-mono text-stone-800 font-semibold">€165</span>
                  </div>

                  {/* Real Ultra-HD Bottle Image */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-950 border border-stone-800 shadow-inner">
                    <Image
                      src="/travel-40ml.jpg"
                      alt="Gris Dior 40 ml Travel Flacon"
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>
                    <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-white text-[10px] uppercase tracking-wider font-mono z-10">
                      <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-xs rounded font-semibold">40 ML</span>
                      <span className="text-stone-300">1.4 FL. OZ</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-serif text-stone-900">
                      The Travel Flacon
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed font-light">
                      Compact and refined. Designed to accompany you effortlessly on voyages and weekend escapes.
                    </p>
                  </div>

                  <div className="pt-2 text-[11px] text-stone-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400">&bull;</span>
                      <span>Approx. 2–3 months of daily wear</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400">&bull;</span>
                      <span>TSA cabin luggage approved</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize("40ml");
                      handleAddToBag();
                    }}
                    className={`w-full py-3.5 text-xs uppercase tracking-[0.2em] font-medium transition-all active:scale-[0.98] ${
                      selectedSize === "40ml"
                        ? "bg-stone-900 text-white hover:bg-stone-800"
                        : "border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white"
                    }`}
                  >
                    {selectedSize === "40ml" ? "Add 40 ml to Bag" : "Select 40 ml"}
                  </button>
                </div>
              </div>
            </TiltCard>

            {/* Format 2: 125 ml (Featured / Most Popular) */}
            <TiltCard
              className={`bg-white rounded-2xl cursor-pointer shadow-md relative transition-all duration-300 hover:shadow-2xl group ${
                selectedSize === "125ml"
                  ? "border-2 border-stone-900 ring-2 ring-stone-900/10"
                  : "border border-stone-300 hover:border-stone-500"
              }`}
            >
              {/* Featured Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-stone-900 text-white text-[9px] tracking-[0.25em] uppercase font-semibold rounded-full z-20">
                Most Coveted
              </div>

              <div
                onClick={() => setSelectedSize("125ml")}
                className="p-8 h-full flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-[11px] tracking-wider uppercase text-stone-500 pt-1">
                    <span>Signature Size</span>
                    <span className="font-mono text-stone-900 font-bold text-sm">€350</span>
                  </div>

                  {/* Real Ultra-HD Bottle Image */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-950 border border-stone-800 shadow-inner">
                    <Image
                      src="/flacon-125ml.jpg"
                      alt="Gris Dior 125 ml Iconic Flacon"
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>
                    <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-white text-[10px] uppercase tracking-wider font-mono z-10">
                      <span className="px-2.5 py-0.5 bg-stone-900 border border-amber-400/50 text-amber-300 backdrop-blur-xs rounded font-semibold">125 ML &bull; ICONIC</span>
                      <span className="text-stone-300">4.2 FL. OZ</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-serif text-stone-900">
                      The Iconic Flacon
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed font-light">
                      The signature proportion. Balances generous longevity with the pure lines of Dior design.
                    </p>
                  </div>

                  <div className="pt-2 text-[11px] text-stone-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-stone-900 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium text-stone-800">Complimentary Custom Engraving</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400">&bull;</span>
                      <span>Approx. 8–10 months of daily wear</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400">&bull;</span>
                      <span>Signature white Dior gift packaging</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize("125ml");
                      handleAddToBag();
                    }}
                    className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white active:scale-[0.98] text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-sm"
                  >
                    {selectedSize === "125ml" ? "Add 125 ml to Bag" : "Select 125 ml"}
                  </button>
                </div>
              </div>
            </TiltCard>

            {/* Format 3: 250 ml */}
            <TiltCard
              className={`bg-white rounded-2xl cursor-pointer transition-all duration-300 shadow-xs hover:shadow-xl group ${
                selectedSize === "250ml"
                  ? "border-2 border-stone-900 ring-2 ring-stone-900/10 shadow-md"
                  : "border border-stone-200/90 hover:border-stone-400"
              }`}
            >
              <div
                onClick={() => setSelectedSize("250ml")}
                className="p-8 h-full flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-[11px] tracking-wider uppercase text-stone-500">
                    <span>Grand Flacon</span>
                    <span className="font-mono text-stone-800 font-semibold">€490</span>
                  </div>

                  {/* Real Ultra-HD Bottle Image */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-950 border border-stone-800 shadow-inner">
                    <Image
                      src="/flacon-250ml.jpg"
                      alt="Gris Dior 250 ml Connoisseur Flacon"
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>
                    <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-white text-[10px] uppercase tracking-wider font-mono z-10">
                      <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-xs rounded font-semibold">250 ML</span>
                      <span className="text-stone-300">8.4 FL. OZ</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-serif text-stone-900">
                      The Connoisseur Flacon
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed font-light">
                      The pinnacle of indulgence. Crafted for passionate devotees of the Gris Dior sillage.
                    </p>
                  </div>

                  <div className="pt-2 text-[11px] text-stone-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-stone-900 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium text-stone-800">Complimentary Custom Engraving</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400">&bull;</span>
                      <span>Over 16+ months of daily wear</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize("250ml");
                      handleAddToBag();
                    }}
                    className={`w-full py-3.5 text-xs uppercase tracking-[0.2em] font-medium transition-all active:scale-[0.98] ${
                      selectedSize === "250ml"
                        ? "bg-stone-900 text-white hover:bg-stone-800"
                        : "border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white"
                    }`}
                  >
                    {selectedSize === "250ml" ? "Add 250 ml to Bag" : "Select 250 ml"}
                  </button>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* FEATURE 3: SCENT FINDER QUIZ (DIAGNOSTIC OLFACTIF PRIVÉ) */}
          <section id="quiz" className="my-24 bg-[#141414] text-[#ede8e1] rounded-3xl p-8 sm:p-14 border border-stone-800 shadow-2xl relative overflow-hidden">
            {/* Subtle luxury background radial glow */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-stone-700/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto space-y-10">
              {/* Quiz Header */}
              <div className="text-center space-y-3">
                <span className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80 font-mono block">
                  Diagnostic Olfactif Privé &bull; Sur-Mesure
                </span>
                <h3 className="text-3xl sm:text-4xl font-serif font-light text-white tracking-wide">
                  Find Your Signature Dior Scent
                </h3>
                <p className="text-stone-400 font-light text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                  Answer two intuitive questions to reveal the creation from La Collection Privée Christian Dior that harmonizes with your personal aura.
                </p>

                {/* Step Indicators */}
                <div className="flex items-center justify-center gap-3 pt-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center gap-2">
                      <span
                        className={`w-7 h-7 rounded-full text-xs flex items-center justify-center font-mono transition-all ${
                          quizStep === step
                            ? "bg-amber-400 text-stone-950 font-bold shadow-md scale-110"
                            : quizStep > step
                            ? "bg-stone-800 text-amber-300 font-medium"
                            : "bg-stone-900 border border-stone-800 text-stone-500"
                        }`}
                      >
                        {quizStep > step ? "✓" : `0${step}`}
                      </span>
                      {step < 3 && <div className={`w-8 h-px ${quizStep > step ? "bg-amber-400/60" : "bg-stone-800"}`} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 1: Olfactory Mood */}
              {quizStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="text-center">
                    <span className="text-xs uppercase tracking-widest text-stone-400 font-mono">
                      Step 01 &bull; Sensory Inspiration
                    </span>
                    <h4 className="text-xl sm:text-2xl font-serif text-white mt-1">
                      Which olfactory atmosphere calls to you?
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        id: "chypre" as const,
                        title: "Floral Chypre & Mystery",
                        notes: "Calabrian Bergamot, Damascena Rose, Amber Oakmoss",
                        desc: "Enigmatic, sophisticated, and universally timeless.",
                      },
                      {
                        id: "amber" as const,
                        title: "Sensual Amber & Rose",
                        notes: "Smoldering Amber, Turkish Rose, Velvety Spice",
                        desc: "Warm, magnetic, and intimate like a couture evening cloak.",
                      },
                      {
                        id: "oud" as const,
                        title: "Smoky Royal Oud",
                        notes: "Smoked Agarwood, Damascus Petals, Frankincense",
                        desc: "Opulent, hypnotic, and filled with palace mystique.",
                      },
                      {
                        id: "marine" as const,
                        title: "Solar Riviera Breeze",
                        notes: "Mediterranean Sea Salt, White Jasmine, Aromatic Pine",
                        desc: "Radiant, fresh, and sun-kissed like the French Riviera.",
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setQuizMood(item.id);
                          setQuizStep(2);
                        }}
                        className={`p-6 text-left rounded-2xl border transition-all duration-300 group hover:-translate-y-1 hover:border-amber-400/60 ${
                          quizMood === item.id
                            ? "bg-stone-900 border-amber-400 shadow-lg ring-1 ring-amber-400/30"
                            : "bg-stone-900/50 border-stone-800 hover:bg-stone-900"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="text-base font-serif font-medium text-white group-hover:text-amber-200">
                            {item.title}
                          </h5>
                          <span className="text-xs text-amber-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                            &rarr;
                          </span>
                        </div>
                        <span className="block text-[11px] font-mono text-amber-400/80 mt-1">
                          {item.notes}
                        </span>
                        <p className="text-xs text-stone-400 font-light mt-2 leading-relaxed">
                          {item.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Wear Occasion */}
              {quizStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="text-center">
                    <span className="text-xs uppercase tracking-widest text-stone-400 font-mono">
                      Step 02 &bull; Presence &amp; Setting
                    </span>
                    <h4 className="text-xl sm:text-2xl font-serif text-white mt-1">
                      Where will your fragrance accompany you?
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        id: "daily" as const,
                        title: "Daily Signature",
                        icon: "🏛️",
                        desc: "Galleries, couture salons, and commanding professional presence.",
                      },
                      {
                        id: "evening" as const,
                        title: "After-Dark Galas",
                        icon: "✨",
                        desc: "Candlelit dinners, opera nights, and unforgettable lingering sillage.",
                      },
                      {
                        id: "coastal" as const,
                        title: "Sunlit Voyages",
                        icon: "🌊",
                        desc: "Weekend coastal escapes, sea breeze retreats, and resort luxury.",
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setQuizOccasion(item.id);
                          setQuizStep(3);
                        }}
                        className={`p-6 text-left rounded-2xl border transition-all duration-300 group hover:-translate-y-1 hover:border-amber-400/60 ${
                          quizOccasion === item.id
                            ? "bg-stone-900 border-amber-400 shadow-lg ring-1 ring-amber-400/30"
                            : "bg-stone-900/50 border-stone-800 hover:bg-stone-900"
                        }`}
                      >
                        <span className="text-2xl block mb-2">{item.icon}</span>
                        <h5 className="text-base font-serif font-medium text-white group-hover:text-amber-200">
                          {item.title}
                        </h5>
                        <p className="text-xs text-stone-400 font-light mt-2 leading-relaxed">
                          {item.desc}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setQuizStep(1)}
                      className="text-xs text-stone-400 hover:text-white uppercase tracking-wider underline font-mono"
                    >
                      &larr; Return to Step 1
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Prescribed Scent Reveal */}
              {quizStep === 3 && (() => {
                let match = {
                  name: "Gris Dior",
                  tag: "Esprit de Parfum • Floral Chypre",
                  percentage: "100%",
                  price: "€350",
                  image: "/hero-luxury-amber.jpg",
                  desc: "Your ideal signature. An iconic harmony of Calabrian citrus, Damascena rose, and oakmoss that defies gender conventions with sheer elegance.",
                };

                if (quizMood === "amber" || (quizOccasion === "evening" && quizMood !== "marine" && quizMood !== "oud")) {
                  match = {
                    name: "Ambre Nuit",
                    tag: "Eau de Parfum • Ambery Sensual",
                    percentage: "98%",
                    price: "€365",
                    image: "/amber-nuit-hd.jpg",
                    desc: "A magnetic, nocturnal collision of dark amber warmth and velvety Turkish rose petals. Perfect for your intimate soirées.",
                  };
                } else if (quizMood === "oud") {
                  match = {
                    name: "Oud Ispahan",
                    tag: "Eau de Parfum • Woody Opulent",
                    percentage: "99%",
                    price: "€330",
                    image: "/oud-ispahan-hd.jpg",
                    desc: "An intoxicating journey through oriental palaces, combining smoked agarwood with regal Damascus blossoms.",
                  };
                } else if (quizMood === "marine" || quizOccasion === "coastal") {
                  match = {
                    name: "Eden-Roc",
                    tag: "Eau de Parfum • Marine Solar",
                    percentage: "97%",
                    price: "€365",
                    image: "/eden-roc-hd.jpg",
                    desc: "A sun-drenched tribute to the French Riviera, capturing sparkling sea salt, Mediterranean pine, and white flowers.",
                  };
                }

                return (
                  <div className="space-y-6 animate-in zoom-in-95 duration-300">
                    <div className="text-center">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-mono block">
                        Your Olfactory Prescription
                      </span>
                      <h4 className="text-2xl sm:text-3xl font-serif text-white mt-1">
                        We Recommend: {match.name}
                      </h4>
                    </div>

                    <TiltCard className="bg-stone-900 border border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        <div className="md:col-span-5 relative aspect-[3/4] rounded-2xl overflow-hidden border border-stone-800 shadow-inner">
                          <Image
                            src={match.image}
                            alt={match.name}
                            fill
                            className="object-cover object-center"
                          />
                          <div className="absolute top-3 left-3 bg-stone-950/90 border border-amber-400/50 text-amber-300 text-[10px] font-mono px-2.5 py-1 rounded-full font-bold">
                            {match.percentage} Match
                          </div>
                        </div>

                        <div className="md:col-span-7 space-y-4">
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-mono block">
                              {match.tag}
                            </span>
                            <h5 className="text-2xl sm:text-3xl font-serif text-white mt-1">
                              {match.name}
                            </h5>
                          </div>

                          <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                            {match.desc}
                          </p>

                          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                handleAddToBag("125ml", match.name, match.image);
                                setIsBagDrawerOpen(true);
                              }}
                              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-[0.2em] font-semibold rounded-xl transition-all shadow-md active:scale-[0.98] text-center"
                            >
                              Add {match.name} &bull; {match.price}
                            </button>
                            <button
                              type="button"
                              onClick={() => setQuizStep(1)}
                              className="px-6 py-3.5 border border-stone-700 hover:border-stone-400 text-stone-300 hover:text-white text-xs uppercase tracking-[0.2em] font-medium rounded-xl transition-all text-center"
                            >
                              Retake Quiz
                            </button>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                );
              })()}
            </div>
          </section>

          {/* 6. COMPANION FRAGRANCE WARDROBE (LA COLLECTION PRIVÉE) */}
          <div id="fragrances" className="pt-12 border-t border-stone-200">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-medium block">
                  Olfactory Wardrobe
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-light text-stone-900">
                  Explore Companion Creations
                </h3>
              </div>
              <p className="text-xs text-stone-500 max-w-sm mt-3 md:mt-0 font-light">
                Discover contrasting olfactory silhouettes from La Collection Privée Christian Dior.
              </p>
            </div>

            {/* 3 Companion Product Cards with 3D Tilt & Ultra-HD Visuals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Product 1: Ambre Nuit */}
              <TiltCard className="bg-[#faf8f5] border border-stone-300/70 rounded-xl hover:shadow-xl hover:border-stone-400 transition-all duration-300">
                <div className="p-6 h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="relative aspect-[3/4] bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                      <Image
                        src="/amber-nuit-hd.jpg"
                        alt="Ambre Nuit Christian Dior"
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, 350px"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-medium block">
                        Ambery &bull; Sensual
                      </span>
                      <h4 className="text-lg font-serif text-stone-900 mt-1">
                        Ambre Nuit
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 font-light leading-relaxed">
                      A tempestuous meeting between the darkness of amber notes and the velvety grace of Turkish rose.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-xs font-mono text-stone-800 font-medium">From €365</span>
                    <a
                      href="#hero"
                      className="text-[11px] uppercase tracking-[0.18em] text-stone-900 font-medium hover:underline"
                    >
                      Discover &rarr;
                    </a>
                  </div>
                </div>
              </TiltCard>

              {/* Product 2: Oud Ispahan */}
              <TiltCard className="bg-[#faf8f5] border border-stone-300/70 rounded-xl hover:shadow-xl hover:border-stone-400 transition-all duration-300">
                <div className="p-6 h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="relative aspect-[3/4] bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                      <Image
                        src="/oud-ispahan-hd.jpg"
                        alt="Oud Ispahan Christian Dior"
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, 350px"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-medium block">
                        Woody &bull; Opulent
                      </span>
                      <h4 className="text-lg font-serif text-stone-900 mt-1">
                        Oud Ispahan
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 font-light leading-relaxed">
                      An intoxicating journey through oriental palaces, where smoldering smoked oud meets fresh Grasse rose.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-xs font-mono text-stone-800 font-medium">From €330</span>
                    <a
                      href="#hero"
                      className="text-[11px] uppercase tracking-[0.18em] text-stone-900 font-medium hover:underline"
                    >
                      Discover &rarr;
                    </a>
                  </div>
                </div>
              </TiltCard>

              {/* Product 3: Eden-Roc */}
              <TiltCard className="bg-[#faf8f5] border border-stone-300/70 rounded-xl hover:shadow-xl hover:border-stone-400 transition-all duration-300">
                <div className="p-6 h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="relative aspect-[3/4] bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                      <Image
                        src="/eden-roc-hd.jpg"
                        alt="Eden-Roc Christian Dior"
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, 350px"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-medium block">
                        Marine &bull; Solar
                      </span>
                      <h4 className="text-lg font-serif text-stone-900 mt-1">
                        Eden-Roc
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 font-light leading-relaxed">
                      A vibrant ode to the French Riviera: sea salt breezes, sunny white blossoms, and aromatic maritime pine.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-xs font-mono text-stone-800 font-medium">From €365</span>
                    <a
                      href="#hero"
                      className="text-[11px] uppercase tracking-[0.18em] text-stone-900 font-medium hover:underline"
                    >
                      Discover &rarr;
                    </a>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* 7. THE APPLICATION RITUAL SECTION */}
        <section id="ritual" className="bg-[#141414] text-[#ede8e1] py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
              <span className="text-[11px] uppercase tracking-[0.25em] text-stone-400 font-medium block">
                Le Geste Parfumé
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light tracking-wide text-white">
                The Application Ritual
              </h2>
              <div className="w-12 h-px bg-stone-600 mx-auto mt-4"></div>
              <p className="text-stone-400 font-light text-base leading-relaxed pt-2">
                Haute Parfumerie is an art of personal presence. Follow the three sacred gestures
                orchestrated by Dior master perfumers to maximize your sillage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-stone-900/60 border border-stone-800 p-8 rounded-2xl flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-2xl font-serif text-stone-500 font-light block">01</span>
                  <h3 className="text-xl font-serif text-white">
                    The Warm Pulse Points
                  </h3>
                  <p className="text-stone-400 text-xs sm:text-sm leading-relaxed font-light">
                    Mist Gris Dior from 20 cm onto the wrists, the hollow of the throat, and behind the ears.
                    Natural body warmth gradually diffuses the volatile floral heart.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-800 text-[10px] uppercase tracking-widest text-stone-400 font-mono">
                  Gesture &bull; Direct Contact
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-stone-900/60 border border-stone-800 p-8 rounded-2xl flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-2xl font-serif text-stone-500 font-light block">02</span>
                  <h3 className="text-xl font-serif text-white">
                    The Sillage Cloud
                  </h3>
                  <p className="text-stone-400 text-xs sm:text-sm leading-relaxed font-light">
                    Spray an upward cloud into the air before you and step through it.
                    Micro-droplets settle weightlessly onto hair fibers, scarves, and silk garments.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-800 text-[10px] uppercase tracking-widest text-stone-400 font-mono">
                  Gesture &bull; Walking Halo
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-stone-900/60 border border-stone-800 p-8 rounded-2xl flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-2xl font-serif text-stone-500 font-light block">03</span>
                  <h3 className="text-xl font-serif text-white">
                    The Extravagant Layer
                  </h3>
                  <p className="text-stone-400 text-xs sm:text-sm leading-relaxed font-light">
                    Pair with the Gris Dior scented body crème or liquid soap.
                    Hydrated skin locks in the oakmoss and patchouli foundation for over 18+ hours.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-800 text-[10px] uppercase tracking-widest text-stone-400 font-mono">
                  Gesture &bull; Endless Trail
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. THE ART OF DIOR GIFTING & UNBOXING */}
        <section id="gifting" className="py-20 px-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Gifting Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-medium block">
                L&apos;Art d&apos;Offrir
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-stone-900 leading-tight">
                The Art of Dior Gifting
              </h2>
              <div className="w-12 h-px bg-stone-400"></div>
              <p className="text-stone-600 font-light text-base leading-relaxed">
                Giving a Dior creation is a gesture of elevated ceremony. Each order is prepared
                by hand in our Paris atelier with meticulous attention to couture tradition.
              </p>

              {/* Gifting Features List */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 font-serif">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm uppercase tracking-wider font-semibold text-stone-900">
                      Iconic White &amp; Gold Packaging
                    </h4>
                    <p className="text-xs text-stone-600 font-light mt-0.5">
                      Wrapped in pristine white textured paper, tied with grosgrain ribbon, and stamped with the Christian Dior seal.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 font-serif">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm uppercase tracking-wider font-semibold text-stone-900">
                      Bespoke Bottle Engraving
                    </h4>
                    <p className="text-xs text-stone-600 font-light mt-0.5">
                      Inscribe initials, a cherished date, or a private message along the curve of the glass flacon.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 font-serif">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm uppercase tracking-wider font-semibold text-stone-900">
                      Two Complimentary Discovery Samples
                    </h4>
                    <p className="text-xs text-stone-600 font-light mt-0.5">
                      Select two deluxe miniatures to test companion fragrances from La Collection Privée before opening your main flacon.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Visual Gifting Box Showcase */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <TiltCard className="w-full aspect-[4/3] rounded-3xl border border-stone-300 shadow-2xl bg-white group cursor-pointer mb-4">
                <Image
                  src={giftingImage}
                  alt="Dior Packaging &amp; Gift Cards Presentation"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none"></div>

                <div
                  style={{ transform: "translateZ(30px)" }}
                  className="absolute bottom-4 inset-x-6 bg-white/95 backdrop-blur-md border border-stone-200/90 p-4 rounded-xl shadow-lg flex items-center justify-between z-10 transition-transform"
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold block">
                      Coffret &bull; Atelier Cadeaux
                    </span>
                    <span className="text-sm font-serif font-medium text-stone-900">
                      {giftingImage === "/gift-luxury.jpg" ? "Iconic White & Gold Coffret" : "Couture Limited Edition Coffret"}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-3 py-1 rounded-md">
                    Complimentary
                  </span>
                </div>
              </TiltCard>

              {/* Gifting Packaging Style Switcher */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mr-1">
                  Packaging:
                </span>
                {[
                  { path: "/gift-luxury.jpg", label: "Iconic White & Gold" },
                  { path: "/hero-pink-dior.jpg", label: "Couture Edition" },
                ].map((style) => (
                  <button
                    key={style.path}
                    type="button"
                    onClick={() => setGiftingImage(style.path)}
                    className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-full transition-all ${
                      giftingImage === style.path
                        ? "bg-stone-900 text-white font-medium shadow-xs"
                        : "bg-stone-200/80 text-stone-600 hover:bg-stone-300"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>

              {/* Emblems Bar */}
              <div className="w-full bg-[#f4efe8] border border-stone-300/80 rounded-2xl p-6 flex items-center justify-around text-center shadow-xs">
                <div>
                  <span className="block text-xl font-serif text-stone-800">CD</span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-500">Wax Seal</span>
                </div>
                <div className="w-px h-8 bg-stone-300"></div>
                <div>
                  <span className="block text-xl font-serif text-stone-800">100%</span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-500">Eco-Craft Paper</span>
                </div>
                <div className="w-px h-8 bg-stone-300"></div>
                <div>
                  <span className="block text-xl font-serif text-stone-800">0€</span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-500">Always Included</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. THE ATELIER & CRAFTSMANSHIP SECTION */}
        <section id="atelier" className="bg-[#f4efe8] border-t border-[#e3dcd1] py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Workshop Image with 3D Tilt */}
              <div className="lg:col-span-6 space-y-4">
                <TiltCard className="relative aspect-[4/3] rounded-2xl border border-stone-300/80 shadow-xl overflow-hidden group cursor-pointer bg-white">
                  <Image
                    src="/atelier-roses-hd.jpg"
                    alt="Atelier de Grasse May Rose Harvest &amp; Christian Dior Botanical Craft"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

                  <div className="absolute top-4 inset-x-6 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white font-medium z-10">
                    <span>Atelier de Grasse</span>
                    <span>Fondé en 1947</span>
                  </div>

                  <div className="absolute bottom-4 inset-x-6 text-[10px] uppercase tracking-wider text-stone-200 text-center border-t border-white/20 pt-2 z-10">
                    Domaine de Manon &bull; Grasse, Provence-Alpes-Côte d&apos;Azur
                  </div>
                </TiltCard>

                <p className="text-xs text-stone-500 italic font-serif text-center sm:text-left">
                  &ldquo;Perfume is the indispensable complement of the female personality, the finishing touch on a dress.&rdquo; &mdash; Christian Dior
                </p>
              </div>

              {/* Right Column: Story & 3 Savoir-Faire Pillars */}
              <div className="lg:col-span-6 space-y-8">
                <div className="space-y-3">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-medium block">
                    Savoir-Faire &amp; Heritage
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-stone-900 leading-tight">
                    The Art of Haute Parfumerie
                  </h2>
                  <div className="w-12 h-px bg-stone-400 mt-2"></div>
                  <p className="text-stone-600 font-light text-base leading-relaxed pt-2">
                    Nestled in the sun-drenched hills of Grasse, our master parfumeurs cultivate
                    rare botanicals that cannot be replicated elsewhere on earth. Every drop of Gris Dior
                    is born of patience, intuition, and century-old French traditions.
                  </p>
                </div>

                {/* 3 Pillars */}
                <div className="space-y-6">
                  {/* Pillar 1 */}
                  <div className="flex gap-4 items-start">
                    <span className="text-xs font-mono font-bold text-stone-400 mt-1">01</span>
                    <div>
                      <h3 className="text-sm uppercase tracking-wider font-semibold text-stone-900">
                        Dawn Harvesting at the Domaine
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed mt-1">
                        May Roses and Grandiflorum Jasmine are hand-gathered exclusively at sunrise,
                        before the heat of the Provençal sun dissipates their volatile aromatic oils.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div className="flex gap-4 items-start">
                    <span className="text-xs font-mono font-bold text-stone-400 mt-1">02</span>
                    <div>
                      <h3 className="text-sm uppercase tracking-wider font-semibold text-stone-900">
                        Patient Cold Maceration
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed mt-1">
                        Rather than rushing with harsh heat, our essences mature over months in
                        temperature-controlled copper vats, allowing the delicate floral facets to marry seamlessly.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className="flex gap-4 items-start">
                    <span className="text-xs font-mono font-bold text-stone-400 mt-1">03</span>
                    <div>
                      <h3 className="text-sm uppercase tracking-wider font-semibold text-stone-900">
                        The Master Flacon Finish
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed mt-1">
                        Each glass flacon is flame-polished for pure transparency, weighted with a dense
                        magnetic cap, and hand-inspected under white light before receiving its bespoke engraving.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. PRESS ACCOLADES & CONNOISSEUR REVIEWS */}
        <section id="reviews" className="py-20 px-6 max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-medium block">
              Témoignages &bull; Press &amp; Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light tracking-wide text-stone-900">
              Praised by Critics
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-amber-600 pt-1">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              <span className="text-xs font-mono text-stone-600 ml-2">4.9 / 5.0 (1,280+ Reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Review 1: Vogue */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-8 flex flex-col justify-between space-y-6 shadow-xs">
              <div className="space-y-4">
                <span className="text-xs font-serif uppercase tracking-[0.25em] font-bold text-stone-900 block">
                  Vogue Magazine
                </span>
                <p className="text-stone-700 font-serif italic text-sm leading-relaxed">
                  &ldquo;Gris Dior is perhaps the most enigmatic fragrance of the century. It blurs gender, seasons, and conventions with breathtaking ease.&rdquo;
                </p>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400 pt-4 border-t border-stone-100">
                Editorial Review &bull; Paris
              </div>
            </div>

            {/* Review 2: Harper's Bazaar */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-8 flex flex-col justify-between space-y-6 shadow-xs">
              <div className="space-y-4">
                <span className="text-xs font-serif uppercase tracking-[0.25em] font-bold text-stone-900 block">
                  Harper&apos;s Bazaar
                </span>
                <p className="text-stone-700 font-serif italic text-sm leading-relaxed">
                  &ldquo;The Damascena rose opening is regal, but the enduring oakmoss sillage is what creates that unforgettable signature trail.&rdquo;
                </p>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400 pt-4 border-t border-stone-100">
                Best Floral Chypre &bull; 2026
              </div>
            </div>

            {/* Review 3: Connoisseur Client */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-8 flex flex-col justify-between space-y-6 shadow-xs">
              <div className="space-y-4">
                <span className="text-xs font-serif uppercase tracking-[0.25em] font-bold text-stone-900 block">
                  Hélène D. &bull; Verified Connoisseur
                </span>
                <p className="text-stone-700 font-serif italic text-sm leading-relaxed">
                  &ldquo;The custom engraving on the 125ml flacon made this an emotional gift. The fragrance lasts literally all day without ever being overpowering.&rdquo;
                </p>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400 pt-4 border-t border-stone-100">
                Purchased 125 ml &bull; Verified Maison Client
              </div>
            </div>
          </div>
        </section>

        {/* 11. INGREDIENTS, SUSTAINABILITY & CLIENT ACCORDION */}
        <section id="details" className="bg-[#f2ece2] border-t border-[#e2d9cd] py-20 px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-medium block">
                Transparence &bull; Information
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-900">
                Formula, Ethics &amp; Delivery
              </h2>
            </div>

            {/* Accordion Container */}
            <div className="space-y-4">
              {/* Accordion Item 1 */}
              <div className="bg-[#faf8f5] border border-stone-300 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion("ingredients")}
                  className="w-full px-6 py-4 flex items-center justify-between text-left text-sm uppercase tracking-wider font-semibold text-stone-900 hover:bg-stone-100/50 transition-colors"
                >
                  <span>Formula &amp; Olfactory Ingredients</span>
                  <span className="text-xl font-light text-stone-500">
                    {activeAccordion === "ingredients" ? "−" : "+"}
                  </span>
                </button>
                {activeAccordion === "ingredients" && (
                  <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-200 space-y-3 font-light">
                    <p>
                      <strong>Active Botanical Ingredients:</strong> ALCOHOL, PARFUM (FRAGRANCE), AQUA (WATER), LIMONENE, LINALOOL, CITRONELLOL, GERANIOL, EVERNIA PRUNASTRI (OAKMOSS) EXTRACT, HYDROXYCITRONELLAL, FARNESOL, CITRAL.
                    </p>
                    <p>
                      Formula created without synthetic phthalates, synthetic parabens, or aggressive preservatives. Contains pure Grasse Centifolia Rose absolute and cold-pressed Calabrian Bergamot essential oils.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion Item 2 */}
              <div className="bg-[#faf8f5] border border-stone-300 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion("sustainability")}
                  className="w-full px-6 py-4 flex items-center justify-between text-left text-sm uppercase tracking-wider font-semibold text-stone-900 hover:bg-stone-100/50 transition-colors"
                >
                  <span>Sustainable Flower Farming &amp; Circular Glass</span>
                  <span className="text-xl font-light text-stone-500">
                    {activeAccordion === "sustainability" ? "−" : "+"}
                  </span>
                </button>
                {activeAccordion === "sustainability" && (
                  <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-200 space-y-3 font-light">
                    <p>
                      The House of Christian Dior has established long-term exclusive partnerships with local flower growers in Grasse. 100% of the roses cultivated at Domaine de Manon follow regenerative biodiversity practices.
                    </p>
                    <p>
                      Our heavy-base glass flacons are composed of 15% post-consumer recycled glass and are completely recyclable once the magnetic atomizer collar is unscrewed.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion Item 3 */}
              <div className="bg-[#faf8f5] border border-stone-300 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full px-6 py-4 flex items-center justify-between text-left text-sm uppercase tracking-wider font-semibold text-stone-900 hover:bg-stone-100/50 transition-colors"
                >
                  <span>White-Glove Shipping &amp; Complimentary Returns</span>
                  <span className="text-xl font-light text-stone-500">
                    {activeAccordion === "shipping" ? "−" : "+"}
                  </span>
                </button>
                {activeAccordion === "shipping" && (
                  <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-200 space-y-3 font-light">
                    <p>
                      All orders are dispatched via climate-controlled express courier within 24 hours of blending. Complimentary next-day delivery applies to all orders over €100.
                    </p>
                    <p>
                      Each flacon includes a matching miniature sample vial. We invite you to test the sample on your skin before opening the sealed crystal flacon. Unopened bottles may be returned within 30 days free of charge.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 12. MAISON FOOTER */}
      <footer className="bg-[#141414] text-[#d6d2cb] border-t border-stone-800">
        {/* Main Footer Directory */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Brand Column (Span 2 on desktop) */}
            <div className="lg:col-span-2 space-y-4">
              <span className="text-2xl sm:text-3xl font-serif tracking-[0.35em] uppercase font-bold text-white block">
                DIOR
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-stone-400 block -mt-1 font-sans">
                Parfums Paris &bull; Haute Parfumerie
              </span>
              <p className="text-xs text-stone-400 font-light leading-relaxed max-w-sm pt-2">
                Created as a modern tribute to Christian Dior’s beloved Granville estate.
                Composed and handcrafted in Grasse, France.
              </p>
              <div className="pt-2 text-[11px] text-stone-500 font-mono">
                Atelier 30 Avenue Montaigne, 75008 Paris
              </div>
            </div>

            {/* Links Column 1: The Collection */}
            <div className="space-y-4">
              <h4 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-stone-200">
                The Collection
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-400 font-light">
                <li><a href="#hero" className="hover:text-white transition-colors">Gris Dior</a></li>
                <li><a href="#fragrances" className="hover:text-white transition-colors">Ambre Nuit</a></li>
                <li><a href="#fragrances" className="hover:text-white transition-colors">Oud Ispahan</a></li>
                <li><a href="#fragrances" className="hover:text-white transition-colors">Eden-Roc</a></li>
                <li><a href="#notes" className="hover:text-white transition-colors">Olfactory Pyramid</a></li>
                <li><a href="#collection" className="hover:text-white transition-colors">Flacon Formats</a></li>
              </ul>
            </div>

            {/* Links Column 2: Client Services */}
            <div className="space-y-4">
              <h4 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-stone-200">
                Client Services
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-400 font-light">
                <li><a href="#gifting" className="hover:text-white transition-colors">Complimentary Engraving</a></li>
                <li><a href="#gifting" className="hover:text-white transition-colors">Iconic Gift Packaging</a></li>
                <li><a href="#gifting" className="hover:text-white transition-colors">Samples with Order</a></li>
                <li><a href="#ritual" className="hover:text-white transition-colors">The Application Ritual</a></li>
                <li><a href="#details" className="hover:text-white transition-colors">Delivery &amp; Returns</a></li>
              </ul>
            </div>

            {/* Links Column 3: Newsletter Sign-Up */}
            <div className="space-y-4">
              <h4 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-stone-200">
                The Private Circle
              </h4>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Join our inner circle for previews of private harvest flacons and atelier journal entries.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-2 pt-1">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-700 text-xs text-white placeholder-stone-500 rounded focus:outline-hidden focus:border-stone-400 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#e8e4dc] hover:bg-white active:scale-[0.98] text-stone-900 text-[11px] uppercase tracking-[0.2em] font-semibold rounded transition-all"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Legal & Copyright Bar */}
          <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 font-light gap-4">
            <div>
              &copy; 2026 CHRISTIAN DIOR PARFUMS &bull; Educational Showcase Project
            </div>
            <div className="flex flex-wrap gap-6 text-[11px] text-stone-400">
              <a href="#hero" className="hover:text-white transition-colors">Privacy Notice</a>
              <a href="#hero" className="hover:text-white transition-colors">Terms of Haute Parfumerie</a>
              <a href="#hero" className="hover:text-white transition-colors">Sustainability Charter</a>
              <a href="#hero" className="hover:text-white transition-colors">Cookie Preferences</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

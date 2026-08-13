'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export function ApearixPreloader() {
  const [mounted, setMounted] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const brandName = "Apearix".split("");

  // 1. Hydration + First-session check
  useEffect(() => {
    setMounted(true);
    const hasSeenIntro = sessionStorage.getItem('apearix-intro-seen');

    if (!hasSeenIntro) {
      sessionStorage.setItem('apearix-intro-seen', 'true');
      setShowPreloader(true);
    }
  }, []);

  // 2. Optimized Readiness (Removed window.load dependency)
  // Now it purely waits for the cinematic sequence to finish (~1.6s)
  useEffect(() => {
    if (!showPreloader) return;

    if (shouldReduceMotion) {
      setMinTimeElapsed(true);
    } else {
      const timer = window.setTimeout(() => {
        setMinTimeElapsed(true);
      }, 1600); // Sequence completes at ~1.45s, exiting at 1.6s
      return () => window.clearTimeout(timer);
    }
  }, [showPreloader, shouldReduceMotion]);

  // 3. Exit Trigger
  useEffect(() => {
    if (!showPreloader || !minTimeElapsed) return;

    const exitTimer = window.setTimeout(
      () => {
        setShowPreloader(false);
      },
      shouldReduceMotion ? 0 : 50 // Micro-buffer before smooth slide-up
    );

    return () => window.clearTimeout(exitTimer);
  }, [showPreloader, minTimeElapsed, shouldReduceMotion]);

  if (!mounted) {
    return null;
  }

  const animationDuration = shouldReduceMotion ? 0 : 0.4;
  const exitDuration = shouldReduceMotion ? 0 : 0.7;

  return (
    <AnimatePresence>
      {showPreloader && (
        <motion.div
          key="apearix-preloader"
          initial={{ opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { y: '-100%' }}
          transition={{
            duration: exitDuration,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-white"
          aria-label="Apearix Preloader"
          role="status"
        >
          {/* Layer 1: Subtle Technical Grid */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
            style={{ 
              backgroundImage: 'linear-gradient(#111827 1px, transparent 1px), linear-gradient(90deg, #111827 1px, transparent 1px)', 
              backgroundSize: '48px 48px' 
            }} 
          />

          {/* Layer 2: Soft Brand Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(109,40,245,0.06)_0%,rgba(109,40,245,0.02)_40%,transparent_70%)] blur-2xl"
          />

          {/* Layer 3: AI Intelligence Pulse (Fires after logo assembly) */}
          {!shouldReduceMotion && (
            <motion.div
              className="absolute left-1/2 top-1/2 z-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6D28F5] blur-md pointer-events-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.12, 0], scale: [0.8, 1.6] }}
              transition={{ duration: 0.8, delay: 0.65, ease: "easeOut" }}
            />
          )}

          {/* Layer 4: Logo Assembly Sequence */}
          <motion.svg
            className="relative z-10 h-16 w-16 md:h-20 md:w-20"
            viewBox="117 128 801 699"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.95,
              filter: shouldReduceMotion ? 'none' : 'blur(4px)',
            }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.6,
              ease: 'easeOut',
            }}
          >
            <defs>
              <linearGradient id="apearixBrandGradient" x1="518" y1="128" x2="518" y2="827" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#D34CFF" />
                <stop offset="35%" stopColor="#C13CF7" />
                <stop offset="70%" stopColor="#8228E8" />
                <stop offset="100%" stopColor="#4D20D8" />
              </linearGradient>
            </defs>

            {/* Center diamond (0.15s) */}
            <motion.path
              d="M 518 317L 587 438L 518 527L 449 438Z"
              fill="url(#apearixBrandGradient)"
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: animationDuration, delay: shouldReduceMotion ? 0 : 0.15, ease: 'backOut' }}
            />

            {/* Main A (0.35s) */}
            <motion.path
              d="M 518 128 L 699 446 L 568 598 L 738 827 L 622 827 L 518 670 L 413 827 L 297 827 L 468 598 L 336 446 Z"
              fill="url(#apearixBrandGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: animationDuration, delay: shouldReduceMotion ? 0 : 0.35 }}
            />

            {/* Left stroke (0.50s) */}
            <motion.path
              d="M 310 492 L 383 572 L 231 827 L 117 827 Z"
              fill="url(#apearixBrandGradient)"
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: animationDuration, delay: shouldReduceMotion ? 0 : 0.50 }}
            />

            {/* Right stroke (0.50s) */}
            <motion.path
              d="M 725 492 L 918 827 L 803 827 L 652 572 Z"
              fill="url(#apearixBrandGradient)"
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: animationDuration, delay: shouldReduceMotion ? 0 : 0.50 }}
            />
          </motion.svg>

          {/* Layer 5: Character Reveal Stagger (0.8s+) */}
          <div className="relative z-10 mt-6 flex text-2xl font-semibold tracking-[-0.03em] text-[#111827]">
            {brandName.map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.3,
                  delay: shouldReduceMotion ? 0 : 0.8 + index * 0.04, // 40ms stagger
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Layer 6: Tagline Reveal (1.15s) */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.4,
              delay: shouldReduceMotion ? 0 : 1.15,
            }}
            className="relative z-10 mt-2 text-sm text-[#6B7280]"
          >
            Engineering Intelligence.
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
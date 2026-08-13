'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export function ApearixPreloader() {
  const [mounted, setMounted] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  // 1. Hydration + First-session check
  useEffect(() => {
    setMounted(true);
    const hasSeenIntro = sessionStorage.getItem('apearix-intro-seen');

    if (!hasSeenIntro) {
      sessionStorage.setItem('apearix-intro-seen', 'true');
      setShowPreloader(true);
    }
  }, []);

  // 2. Minimum animation time logic
  useEffect(() => {
    if (!showPreloader) return;

    if (shouldReduceMotion) {
      setMinTimeElapsed(true);
    } else {
      const timer = window.setTimeout(() => {
        setMinTimeElapsed(true);
      }, 1300);
      return () => window.clearTimeout(timer);
    }
  }, [showPreloader, shouldReduceMotion]);

  // 3. Browser readiness tracking
  useEffect(() => {
    if (!showPreloader) return;

    const handleLoad = () => {
      setPageReady(true);
    };

    if (document.readyState === 'complete') {
      setPageReady(true);
      return;
    }

    window.addEventListener('load', handleLoad);
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, [showPreloader]);

  // 4. Exit only when animation + page are ready
  useEffect(() => {
    if (!showPreloader || !minTimeElapsed || !pageReady) return;

    const exitTimer = window.setTimeout(
      () => {
        setShowPreloader(false);
      },
      shouldReduceMotion ? 0 : 150 // Tiny buffer for smooth exit
    );

    return () => window.clearTimeout(exitTimer);
  }, [showPreloader, minTimeElapsed, pageReady, shouldReduceMotion]);

  if (!mounted) {
    return null;
  }

  // Proper reduced motion durations
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
          {/* Constrained Subtle Brand Glow (Not full screen) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(109,40,245,0.08)_0%,rgba(109,40,245,0.035)_35%,transparent_72%)] blur-2xl"
          />

          {/* Logo SVG */}
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
              <linearGradient
                id="apearixBrandGradient"
                x1="518"
                y1="128"
                x2="518"
                y2="827"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#D34CFF" />
                <stop offset="35%" stopColor="#C13CF7" />
                <stop offset="70%" stopColor="#8228E8" />
                <stop offset="100%" stopColor="#4D20D8" />
              </linearGradient>
            </defs>

            {/* Center diamond (0ms) */}
            <motion.path
              d="M 518 317L 587 438L 518 527L 449 438Z"
              fill="url(#apearixBrandGradient)"
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: animationDuration, ease: 'backOut' }}
            />

            {/* Main A (100ms) */}
            <motion.path
              d="M 518 128 L 699 446 L 568 598 L 738 827 L 622 827 L 518 670 L 413 827 L 297 827 L 468 598 L 336 446 Z"
              fill="url(#apearixBrandGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: animationDuration, delay: shouldReduceMotion ? 0 : 0.1 }}
            />

            {/* Left stroke (300ms) */}
            <motion.path
              d="M 310 492 L 383 572 L 231 827 L 117 827 Z"
              fill="url(#apearixBrandGradient)"
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: animationDuration, delay: shouldReduceMotion ? 0 : 0.3 }}
            />

            {/* Right stroke (300ms) */}
            <motion.path
              d="M 725 492 L 918 827 L 803 827 L 652 572 Z"
              fill="url(#apearixBrandGradient)"
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: animationDuration, delay: shouldReduceMotion ? 0 : 0.3 }}
            />
          </motion.svg>

          {/* Brand name (500ms) */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.4,
              delay: shouldReduceMotion ? 0 : 0.5,
            }}
            className="relative z-10 mt-6 text-2xl font-semibold tracking-[-0.03em] text-[#111827]"
          >
            Apearix
          </motion.div>

          {/* Tagline (750ms) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.4,
              delay: shouldReduceMotion ? 0 : 0.75,
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
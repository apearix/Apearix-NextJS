'use client';

import { motion, type Transition } from 'framer-motion';

export default function ApearixFlow() {
    const times = [0, 0.15, 0.20, 0.33, 0.38, 0.53, 0.58, 0.73, 0.78, 0.90, 0.95, 1];

    const cinTrans: Transition = {
        duration: 15,
        repeat: Infinity,
        ease: 'easeInOut',
        times,
    };
    const dashTrans: Transition = {
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
    };

    // Coordinated Morphing Coordinates for 4 Dynamic Nodes
    const N1_x = [0, 0, 0, 0, -40, -40, -60, -60, 0, 0, 0, 0];
    const N1_y = [0, 0, -50, -50, -40, -40, -40, -40, -70, -70, 0, 0];

    const N2_x = [0, 0, -45, -45, 0, 0, -60, -60, -60, -60, 0, 0];
    const N2_y = [0, 0, 30, 30, 50, 50, 40, 40, 40, 40, 0, 0];

    const N3_x = [0, 0, 45, 45, -40, -40, 60, 60, 60, 60, 0, 0];
    const N3_y = [0, 0, 30, 30, 40, 40, 40, 40, 40, 40, 0, 0];

    const N4_x = [0, 0, 0, 0, 40, 40, 60, 60, 0, 0, 0, 0];
    const N4_y = [0, 0, 0, 0, 0, 0, -40, -40, 70, 70, 0, 0];

    // Opacity Layers for Storytelling
    const logoOpacity = [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
    const logoScale = [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
    const coreOpacity = [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0];

    const aiText = [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    const agentText = [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0];
    const softText = [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0];
    const saasText = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0];

    return (
        <div className="relative mt-6 flex items-center justify-center lg:mt-0 w-full h-full lg:col-span-5">

            {/* Background Cinematic Camera Motion */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [0.95, 1, 1.05, 1.05, 1, 0.95, 0.95], y: [0, -5, -5, 5, 5, 0, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            >
                {/* Deep Pulsing Glow (Independent of structure) */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute w-30 h-30 sm:w-80 sm:h-80  rounded-full bg-[radial-gradient(circle_at_center,rgba(109,40,245,0.12)_0%,transparent_60%)] blur-2xl"
                />

                <svg viewBox="-150 -150 300 300" className="absolute inset-0 w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="primaryGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#A855F7" />
                            <stop offset="100%" stopColor="#6D28F5" />
                        </linearGradient>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="rgba(109,40,245,0.05)" />
                            <stop offset="50%" stopColor="rgba(109,40,245,0.3)" />
                            <stop offset="100%" stopColor="rgba(109,40,245,0.05)" />
                        </linearGradient>
                    </defs>

                    {/* ---------------------------------------------------- */}
                    {/* LAYER 1: STRUCTURAL LINES (MORPHING)                 */}
                    {/* ---------------------------------------------------- */}
                    <motion.g animate={{ opacity: coreOpacity }} transition={cinTrans}>
                        {/* Center to Nodes */}
                        <motion.line x1="0" y1="0" stroke="url(#lineGrad)" strokeWidth="1" animate={{ x2: N1_x, y2: N1_y }} transition={cinTrans} />
                        <motion.line x1="0" y1="0" stroke="url(#lineGrad)" strokeWidth="1" animate={{ x2: N2_x, y2: N2_y }} transition={cinTrans} />
                        <motion.line x1="0" y1="0" stroke="url(#lineGrad)" strokeWidth="1" animate={{ x2: N3_x, y2: N3_y }} transition={cinTrans} />
                        <motion.line x1="0" y1="0" stroke="url(#lineGrad)" strokeWidth="1" animate={{ x2: N4_x, y2: N4_y }} transition={cinTrans} />

                        {/* Perimeter Connections (Forms the shapes) */}
                        <motion.line stroke="url(#lineGrad)" strokeWidth="0.75" animate={{ x1: N1_x, y1: N1_y, x2: N2_x, y2: N2_y }} transition={cinTrans} />
                        <motion.line stroke="url(#lineGrad)" strokeWidth="0.75" animate={{ x1: N2_x, y1: N2_y, x2: N3_x, y2: N3_y }} transition={cinTrans} />
                        <motion.line stroke="url(#lineGrad)" strokeWidth="0.75" animate={{ x1: N3_x, y1: N3_y, x2: N4_x, y2: N4_y }} transition={cinTrans} />
                        <motion.line stroke="url(#lineGrad)" strokeWidth="0.75" animate={{ x1: N4_x, y1: N4_y, x2: N1_x, y2: N1_y }} transition={cinTrans} />
                    </motion.g>

                    {/* ---------------------------------------------------- */}
                    {/* LAYER 2: SIGNAL FLOW (TRAVELING DASHED LINES)        */}
                    {/* ---------------------------------------------------- */}
                    <motion.g animate={{ opacity: coreOpacity }} transition={cinTrans}>
                        <motion.line x1="0" y1="0" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="2 12" animate={{ x2: N1_x, y2: N1_y, strokeDashoffset: [0, -100] }} transition={{ ...cinTrans, strokeDashoffset: { duration: 2, repeat: Infinity, ease: 'linear' } }} />
                        <motion.line x1="0" y1="0" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="2 12" animate={{ x2: N3_x, y2: N3_y, strokeDashoffset: [0, -100] }} transition={{ ...cinTrans, strokeDashoffset: { duration: 2.5, repeat: Infinity, ease: 'linear' } }} />
                    </motion.g>

                    {/* ---------------------------------------------------- */}
                    {/* LAYER 3: DYNAMIC NODES                               */}
                    {/* ---------------------------------------------------- */}
                    <motion.g animate={{ opacity: coreOpacity }} transition={cinTrans}>
                        {/* Core Node Pulse */}
                        <motion.circle cx="0" cy="0" r="10" fill="rgba(109,40,245,0.15)" animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }} transition={{ duration: 2, repeat: Infinity }} />
                        <circle cx="0" cy="0" r="4.5" fill="#6D28F5" />

                        {/* Moving Nodes */}
                        <motion.circle r="3.5" fill="#6D28F5" animate={{ cx: N1_x, cy: N1_y }} transition={cinTrans} />
                        <motion.circle r="3.5" fill="#6D28F5" animate={{ cx: N2_x, cy: N2_y }} transition={cinTrans} />
                        <motion.circle r="3.5" fill="#6D28F5" animate={{ cx: N3_x, cy: N3_y }} transition={cinTrans} />
                        <motion.circle r="3.5" fill="#6D28F5" animate={{ cx: N4_x, cy: N4_y }} transition={cinTrans} />
                    </motion.g>

                    {/* ---------------------------------------------------- */}
                    {/* LAYER 4: SOFTWARE UI BOX (Appears only in phase 3)   */}
                    {/* ---------------------------------------------------- */}
                    <motion.rect
                        rx="4"
                        fill="#6D28F5"
                        animate={{
                            opacity: softText,
                            scale: [0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 1, 1, 0.9, 0.9, 0.9, 0.9],
                        }}
                        transition={cinTrans}
                    />

                    {/* ---------------------------------------------------- */}
                    {/* LAYER 5: TEXT & LABELS (Fading in and out on position)*/}
                    {/* ---------------------------------------------------- */}
                    <g fill="#6B7280" fontSize="8" fontWeight="600" letterSpacing="0.1em" textAnchor="middle">
                        {/* AI Phase */}
                        <motion.g animate={{ opacity: aiText }} transition={cinTrans}>
                            <text x="0" y="16" fill="#6D28F5">AI CORE</text>
                            <text x="0" y="-60">CONTEXT</text>
                            <text x="-55" y="45">REASONING</text>
                            <text x="55" y="45">KNOWLEDGE</text>
                        </motion.g>

                        {/* Agent Phase */}
                        <motion.g animate={{ opacity: agentText }} transition={cinTrans}>
                            <text x="0" y="16" fill="#6D28F5">AGENT</text>
                            <text x="-40" y="-50">SEARCH</text>
                            <text x="-40" y="55">ANALYZE</text>
                            <text x="55" y="5">TOOLS</text>
                            <text x="40" y="-50">ACT</text>
                        </motion.g>

                        {/* Software Phase */}
                        <motion.g animate={{ opacity: softText }} transition={cinTrans}>
                            <text x="0" y="16" fill="#6D28F5">SOFTWARE</text>
                            <text x="-60" y="-50">UI</text>
                            <text x="-60" y="55">API</text>
                            <text x="60" y="-50">LOGIC</text>
                            <text x="60" y="55">DB</text>
                        </motion.g>

                        {/* Cloud Phase */}
                        <motion.g animate={{ opacity: saasText }} transition={cinTrans}>
                            <text x="0" y="16" fill="#6D28F5">SAAS</text>
                            <text x="0" y="-80">PRODUCT</text>
                            <text x="-60" y="55">USERS</text>
                            <text x="60" y="55">WORKFLOW</text>
                            <text x="0" y="85">SCALE</text>
                        </motion.g>
                    </g>
                </svg>
            </motion.div>

            {/* ---------------------------------------------------- */}
            {/* LAYER 6: APEARIX LOGO (Start and End of Loop)        */}
            {/* ---------------------------------------------------- */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                animate={{ opacity: logoOpacity, scale: logoScale }}
                transition={cinTrans}
            >
                <svg viewBox="117 128 801 699" fill="none" className="w-30 h-30 sm:w-60 sm:h-60 drop-shadow-[0_12px_24px_rgba(109,40,245,0.15)]">
                    <defs>
                        <linearGradient id="logoGradient" x1="518" y1="128" x2="518" y2="827"
                            gradientUnits="userSpaceOnUse" >
                            <stop offset="0%" stopColor="#D34CFF" />
                            <stop offset="35%" stopColor="#C13CF7" />
                            <stop offset="70%" stopColor="#8228E8" />
                            <stop offset="100%" stopColor="#4D20D8" />
                        </linearGradient>
                    </defs>
                    <path d=" M 518 128 L 699 446 L 568 598 L 738 827 L 622 827 L 518 670 L 413 827 L 297 827 L 468 598 L 336 446 Z
                    M 518 317L 587 438L 518 527L 449 438Z"
                        fill="url(#logoGradient)"
                        fillRule="evenodd"
                        clipRule="evenodd"
                    />
                    <path
                        d=" M 310 492  L 383 572  L 231 827 L 117 827 Z "
                        fill="url(#logoGradient)"
                    />
                    <path d="  M 725 492  L 918 827  L 803 827  L 652 572  Z" fill="url(#logoGradient)" />
                </svg>
            </motion.div>
        </div>
    );
}
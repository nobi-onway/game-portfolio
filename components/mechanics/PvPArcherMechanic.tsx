"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function PvPArcherMechanic() {
    const [state, setState] = useState<"idle" | "p1_attack" | "p2_hit" | "p2_attack" | "p1_block">("idle");

    useEffect(() => {
        const controller = new AbortController();
        const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        const runCycle = async () => {
            while (!controller.signal.aborted) {
                // 1. Idle
                setState("idle");
                await wait(1500);

                // 2. Player 1 Attacks
                setState("p1_attack");
                await wait(800); // Arrow flight time

                // 3. Player 2 Hit
                setState("p2_hit");
                await wait(600);

                // 4. Player 2 Counter Attacks
                setState("p2_attack");
                await wait(800);

                // 5. Player 1 Blocks
                setState("p1_block");
                await wait(1000);
            }
        };

        runCycle();
        return () => controller.abort();
    }, []);

    // Arrow Component
    const Arrow = ({ direction }: { direction: "right" | "left" }) => (
        <motion.div
            initial={{ x: direction === "right" ? -10 : 10, y: 0, opacity: 0, rotate: direction === "right" ? -45 : 45 }}
            animate={{
                x: direction === "right" ? 50 : -50,
                y: [0, -30, 5],
                opacity: [0, 1, 1],
                rotate: direction === "right" ? [-45, 0, 45] : [45, 0, -45]
            }}
            transition={{ duration: 0.6, ease: "linear", times: [0, 0.5, 1] }}
            className={`absolute top-1/2 w-6 h-1 ${direction === "right" ? "bg-cyan-400" : "bg-red-500"} rounded-full shadow-[0_0_8px_currentColor] z-20`}
        />
    );

    return (
        <div className="bg-neutral-900/90 w-[120px] h-[100px] rounded-lg border border-white/10 relative overflow-hidden flex items-center justify-between px-4 shadow-xl backdrop-blur-sm">
            {/* Arena Background */}
            <div className="absolute inset-0 bg-neutral-800">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5" /> {/* Midline */}
                <div className="absolute bottom-0 w-full h-1/3 bg-black/40" /> {/* Ground */}
                {/* Pillars */}
                <div className="absolute bottom-1/3 left-2 w-4 h-16 bg-neutral-700/50 rounded-t" />
                <div className="absolute bottom-1/3 right-2 w-4 h-16 bg-neutral-700/50 rounded-t" />
            </div>

            {/* Player 1 (Blue) */}
            <motion.div
                animate={
                    state === "idle" ? { y: [0, -2, 0] } :
                        state === "p1_attack" ? { scale: 1.1, x: 2 } :
                            state === "p1_block" ? { scale: 1, filter: "brightness(1.5)" } :
                                { y: 0 }
                }
                transition={state === "idle" ? { duration: 1.5, repeat: Infinity } : { duration: 0.2 }}
                className="relative z-10 w-6 h-9 flex flex-col items-center justify-end"
            >
                {/* Shield Effect */}
                <AnimatePresence>
                    {state === "p1_block" && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 0.6 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute inset-0 bg-cyan-400/30 rounded-full border border-cyan-400 blur-sm"
                        />
                    )}
                </AnimatePresence>

                {/* Bow */}
                {state === "p1_attack" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute right-[-4px] top-3 w-0.5 h-5 border-r border-cyan-200 rounded-r-full"
                    />
                )}

                {/* Body */}
                <div className="w-3 h-3 bg-cyan-500 rounded-full mb-[-1px] relative z-20" /> {/* Head */}
                <div className="w-4 h-6 bg-cyan-700 rounded-lg relative z-10 flex items-center justify-center">
                    <div className="w-2.5 h-4 bg-cyan-900/30 rounded" /> {/* Armor detail */}
                </div>
            </motion.div>

            {/* Projectiles */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {state === "p1_attack" && <Arrow direction="right" />}
                {state === "p2_attack" && <Arrow direction="left" />}
            </div>

            {/* Player 2 (Red) */}
            <motion.div
                animate={
                    state === "idle" ? { y: [0, -2, 0] } :
                        state === "p2_hit" ? { x: [0, 5, -5, 0], filter: "brightness(2)" } :
                            state === "p2_attack" ? { scale: 1.1, x: -2 } :
                                { y: 0 }
                }
                transition={state === "idle" ? { duration: 1.5, repeat: Infinity, delay: 0.2 } : { duration: 0.1 }}
                className="relative z-10 w-6 h-9 flex flex-col items-center justify-end"
            >
                {/* Hit Effect */}
                <AnimatePresence>
                    {state === "p2_hit" && (
                        <motion.div
                            initial={{ scale: 1 }}
                            animate={{ scale: 2, opacity: 0 }}
                            className="absolute top-1 w-6 h-6 bg-red-500/50 rounded-full blur-md"
                        />
                    )}
                </AnimatePresence>

                {/* Bow */}
                {state === "p2_attack" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute left-[-4px] top-3 w-0.5 h-5 border-l border-red-200 rounded-l-full"
                    />
                )}

                {/* Body */}
                <div className="w-3 h-3 bg-red-500 rounded-full mb-[-1px] relative z-20" /> {/* Head */}
                <div className="w-4 h-6 bg-red-700 rounded-lg relative z-10 flex items-center justify-center">
                    <div className="w-2.5 h-4 bg-red-900/30 rounded" /> {/* Armor detail */}
                </div>
            </motion.div>
        </div>
    );
}

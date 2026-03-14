"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function ZombieShooterMechanic() {
    const [zombies, setZombies] = useState<{ id: number; x: number; y: number }[]>([]);
    const [crosshair, setCrosshair] = useState({ x: 50, y: 50 });
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setZombies(prev => {
                // Add new zombie
                if (Math.random() > 0.8 && prev.length < 3) {
                    const id = counter + 1;
                    setCounter(id);
                    return [...prev, { id, x: Math.random() * 80 + 10, y: Math.random() * 60 + 20 }];
                }
                return prev;
            });

            // Move crosshair towards a zombie
            setZombies(prev => {
                if (prev.length > 0) {
                    const target = prev[0];
                    setCrosshair(curr => ({
                        x: curr.x + (target.x - curr.x) * 0.2,
                        y: curr.y + (target.y - curr.y) * 0.2,
                    }));
                    
                    // Shoot if close
                    if (Math.abs(crosshair.x - target.x) < 5 && Math.abs(crosshair.y - target.y) < 5) {
                        return prev.slice(1);
                    }
                } else {
                    // Wander crosshair
                    setCrosshair(curr => ({
                        x: curr.x + (Math.random() - 0.5) * 5,
                        y: curr.y + (Math.random() - 0.5) * 5,
                    }));
                }
                return prev;
            });
        }, 150);
        return () => clearInterval(interval);
    }, [counter, crosshair]);

    return (
        <div className="bg-neutral-900/90 w-[120px] h-[100px] rounded-lg border border-white/10 relative overflow-hidden shadow-xl backdrop-blur-sm">
            {/* Background */}
            <div className="absolute inset-0 bg-neutral-950">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,#444_0%,transparent_70%)]" />
            </div>

            {/* Zombies */}
            <AnimatePresence>
                {zombies.map(z => (
                    <motion.div
                        key={z.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1, x: `${z.x}%`, y: `${z.y}%` }}
                        exit={{ opacity: 0, scale: 2, filter: "brightness(2)" }}
                        className="absolute text-lg -translate-x-1/2 -translate-y-1/2"
                    >
                        🧟
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Crosshair */}
            <motion.div
                animate={{ left: `${crosshair.x}%`, top: `${crosshair.y}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
                className="absolute size-6 border border-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
            >
                <div className="size-0.5 bg-red-500" />
                <div className="absolute w-4 h-[1px] bg-red-500/50" />
                <div className="absolute h-4 w-[1px] bg-red-500/50" />
            </motion.div>

            <div className="absolute bottom-2 left-0 right-0 text-[8px] text-center text-white/30 uppercase tracking-tighter">
                FPS Mechanics
            </div>
        </div>
    );
}

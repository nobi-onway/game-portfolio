"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function KnightsVsOrcsMechanic() {
    const [units, setUnits] = useState<{ id: number; type: "knight" | "orc"; x: number }[]>([]);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setUnits(prev => {
                // Move units
                const moved = prev.map(u => ({
                    ...u,
                    x: u.type === "knight" ? u.x + 2 : u.x - 2
                }));

                // Logic to remove units that collide
                const knights = moved.filter(u => u.type === "knight");
                const orcs = moved.filter(u => u.type === "orc");
                
                let remaining = [...moved];
                
                knights.forEach(k => {
                    orcs.forEach(o => {
                        if (Math.abs(k.x - o.x) < 5) {
                            remaining = remaining.filter(u => u.id !== k.id && u.id !== o.id);
                        }
                    });
                });

                // Spawn logic
                if (Math.random() > 0.7 && remaining.length < 6) {
                    const id = counter + 1;
                    setCounter(id);
                    const type = Math.random() > 0.5 ? "knight" : "orc";
                    remaining.push({
                        id,
                        type,
                        x: type === "knight" ? 0 : 100
                    });
                }
                
                // Remove out of bounds
                return remaining.filter(u => u.x >= -10 && u.x <= 110);
            });
        }, 100);
        return () => clearInterval(interval);
    }, [counter]);

    return (
        <div className="bg-neutral-900/90 w-[120px] h-[100px] rounded-lg border border-white/10 relative overflow-hidden shadow-xl backdrop-blur-sm">
            {/* Battlefield */}
            <div className="absolute inset-0 bg-neutral-800">
                <div className="absolute bottom-0 w-full h-1/4 bg-green-900/20" />
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5" />
            </div>

            <AnimatePresence>
                {units.map(unit => (
                    <motion.div
                        key={unit.id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1, x: `${unit.x}%` }}
                        exit={{ opacity: 0, scale: 1.5, filter: "brightness(2)" }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-[40%] text-lg transform -translate-x-1/2"
                    >
                        {unit.type === "knight" ? "⚔️" : "👾"}
                    </motion.div>
                ))}
            </AnimatePresence>
            
            <div className="absolute bottom-2 left-0 right-0 text-[8px] text-center text-white/30 uppercase tracking-tighter">
                Strategy Battle
            </div>
        </div>
    );
}

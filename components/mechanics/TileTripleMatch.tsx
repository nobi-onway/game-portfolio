"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function TileTripleMatch() {
    // 0, 1, 2 are types of tiles. We want to match type 1 (e.g., Red).
    interface Tile {
        id: number;
        type: string;
        x?: number;
        y?: number;
    }

    const [tiles, setTiles] = useState<Tile[]>([
        { id: 1, type: "🍎", x: 0, y: 0 },
        { id: 2, type: "🍌", x: 30, y: 0 },
        { id: 3, type: "🍎", x: 60, y: 0 },
        { id: 4, type: "🍇", x: 0, y: 30 },
        { id: 5, type: "🍎", x: 30, y: 30 },
        { id: 6, type: "🍌", x: 60, y: 30 },
    ]);

    const [tray, setTray] = useState<Tile[]>([]);
    const [cleared, setCleared] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const wait = (ms: number) =>
            new Promise<void>((resolve, reject) => {
                const timer = setTimeout(() => resolve(), ms);
                controller.signal.addEventListener("abort", () => {
                    clearTimeout(timer);
                    reject(new Error("Aborted"));
                }, { once: true });
            });

        const animate = async () => {
            try {
                // Infinite loop for continuous animation
                while (!controller.signal.aborted) {
                    // Wait start
                    await wait(1000);

                    // Move first Apple
                    setTiles((prev) => prev.filter((t) => t.id !== 1));
                    setTray((prev) => [...prev, { id: 1, type: "🍎" }]);
                    await wait(600);

                    // Move second Apple
                    setTiles((prev) => prev.filter((t) => t.id !== 3));
                    setTray((prev) => [...prev, { id: 3, type: "🍎" }]);
                    await wait(600);

                    // Move third Apple
                    setTiles((prev) => prev.filter((t) => t.id !== 5));
                    setTray((prev) => [...prev, { id: 5, type: "🍎" }]);
                    await wait(600);

                    // Clear
                    setCleared(true);
                    await wait(500);
                    setTray([]);

                    // Reset
                    await wait(500);
                    setCleared(false);
                    setTiles([
                        { id: 1, type: "🍎", x: 0, y: 0 },
                        { id: 2, type: "🍌", x: 30, y: 0 },
                        { id: 3, type: "🍎", x: 60, y: 0 },
                        { id: 4, type: "🍇", x: 0, y: 30 },
                        { id: 5, type: "🍎", x: 30, y: 30 },
                        { id: 6, type: "🍌", x: 60, y: 30 },
                    ]);
                }
            } catch (error: unknown) {
                // Ignore AbortError, log others
                if (error instanceof Error && error.message !== "Aborted") {
                    console.error("Animation error:", error);
                }
            }
        };

        animate();

        return () => {
            controller.abort();
        };
    }, []);

    return (
        <div className="bg-neutral-900/90 p-2 rounded-lg border border-white/10 w-[120px] h-[100px] flex flex-col items-center justify-between shadow-xl backdrop-blur-sm">
            {/* Game Board */}
            <div className="relative w-[90px] h-[60px]">
                <AnimatePresence>
                    {tiles.map((tile) => (
                        <motion.div
                            key={tile.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, x: tile.x, y: tile.y }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute w-[25px] h-[25px] bg-white rounded-md flex items-center justify-center text-sm shadow-sm border border-neutral-200"
                        >
                            {tile.type}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Tray */}
            <div className="w-[74px] h-[30px] bg-black/50 rounded-md flex items-center justify-center px-1 gap-1 overflow-hidden border border-white/5 relative">
                <AnimatePresence>
                    {tray.map((tile) => (
                        <motion.div
                            key={tile.id}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0, filter: "brightness(2)" }}
                            className="w-[20px] h-[20px] bg-white rounded-sm flex items-center justify-center text-xs"
                        >
                            {tile.type}
                        </motion.div>
                    ))}
                </AnimatePresence>
                {cleared && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1.2 }}
                        className="absolute inset-0 flex items-center justify-center text-yellow-400 font-bold text-xs"
                    >
                        MATCH!
                    </motion.div>
                )}
            </div>
        </div>
    );
}

'use client';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import Image from 'next/image';

const PHILOSOPHY = [
  {
    number: '01',
    title: 'Practical & Clear',
    body: 'Always aiming for technical solutions with high practical value for the product.',
  },
  {
    number: '02',
    title: 'Minimalist & Responsible',
    body: 'Clean code, transparent architecture, and always taking responsibility for the product.',
  },
  {
    number: '03',
    title: 'Decisive & Optimistic',
    body: "Never giving up on difficult bugs, always ready to change for the better.",
  },
];

const STATS = [
  { label: 'Soft Skills', value: 'Communication, Team Connection' },
  { label: 'Direction', value: 'Technical Artist' },
];

function AboutMe() {
  return (
    <section className="relative mx-auto mt-32 mb-32 px-4 lg:max-w-[1100px] lg:px-0" id="about-me">
      {/* Decorative Background Glows */}
      <div className="absolute -top-24 -left-24 size-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 size-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col lg:flex-row gap-16 items-center lg:items-start mb-24">
        
        {/* ── Left: Profile Image ── */}
        <AnimatedSection preset="slideLeft" className="w-full lg:w-[38%] flex justify-center sticky top-24">
          <div className="relative group w-full max-w-[400px]">
            {/* Multi-layered Glow */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary/40 to-purple-500/20 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
            <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-700 group-hover:scale-[1.01] group-hover:border-primary/30">
              <Image 
                src="/images/me/career.png" 
                alt="Đoàn Gia Bảo - Profile" 
                width={450} 
                height={550} 
                className="object-cover w-full h-auto aspect-[4/5] scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
                priority
              />
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
              
              {/* Subtle Scanline Effect on Hover */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>

            {/* Floating Experience Badge */}
            <motion.div 
              className="absolute -bottom-6 -right-6 glass-card p-5 border-primary/40 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-10"
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1, rotate: -3 }}
            >
              <div className="text-center">
                <span className="block text-3xl font-black text-primary drop-shadow-[0_0_15px_rgba(0,119,255,0.5)]">2+</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Years Exp</span>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* ── Right: Personal Info ── */}
        <div className="w-full lg:w-[62%] space-y-10">
          <AnimatedSection preset="fadeUp">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="h-[1px] w-8 bg-primary/50" />
              <h2 className="section-label">The Visionary</h2>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[0.9]">
              DOAN GIA BAO
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 font-light italic leading-relaxed relative pl-8">
              <span className="absolute left-0 top-0 text-4xl text-primary/30 font-serif leading-none">&ldquo;</span>
              Realism to solve problems, Minimalism to optimize performance, Decisiveness to achieve the best quality.
              <span className="text-4xl text-primary/30 font-serif leading-none align-bottom ml-1">&rdquo;</span>
            </p>
          </AnimatedSection>

          <AnimatedSection preset="fadeUp" delay={0.1}>
            <div className="space-y-4">
              <p className="text-[var(--text-muted)] text-lg leading-relaxed max-w-2xl">
                A game developer with a focus on bridging the gap between <span className="text-white font-medium">technical implementation</span> and <span className="text-white font-medium">visual excellence</span>. 
              </p>
              <p className="text-[var(--text-muted)] text-lg leading-relaxed max-w-2xl">
                My journey is driven by a constant curiosity about game mechanics and a desire to build experiences 
                that are not only functional but also <span className="text-primary italic font-medium">&ldquo;beautiful and smooth&rdquo;</span>.
              </p>
            </div>
          </AnimatedSection>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-card p-6 border-white/5 bg-white/[0.03] group/stat overflow-hidden relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.15 }}
                whileHover={{ 
                  backgroundColor: 'rgba(255,255,255,0.05)', 
                  borderColor: 'rgba(0,119,255,0.3)',
                  y: -5
                }}
              >
                {/* Hover Accent */}
                <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover/stat:h-full transition-all duration-300" />
                
                <h5 className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-2 opacity-80 group-hover/stat:opacity-100 transition-opacity">
                  {stat.label}
                </h5>
                <p className="text-base font-semibold text-white/90 group-hover/stat:text-white transition-colors">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Philosophy & Path Section ── */}
      <div className="grid lg:grid-cols-5 gap-8 items-stretch">
        {/* Core Philosophy Card - Span 3 */}
        <AnimatedSection preset="slideLeft" className="lg:col-span-3">
          <div className="h-full rounded-2xl border border-white/5 p-10 relative overflow-hidden group bg-secondary/40 backdrop-blur-sm">
            {/* Animated background element */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-700" />
            
            <div className="flex items-center gap-4 mb-10">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <div className="size-2 rounded-full bg-primary animate-pulse" />
              </div>
              <h4 className="text-2xl font-bold tracking-tight">Core Philosophy</h4>
            </div>
            
            <div className="grid sm:grid-cols-1 gap-8">
              {PHILOSOPHY.map((item) => (
                <div key={item.number} className="flex gap-6 group/item">
                  <div className="relative flex-shrink-0">
                    <span className="font-mono text-xs font-black text-primary bg-primary/10 border border-primary/20 size-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover/item:bg-primary group-hover/item:text-white group-hover/item:scale-110">
                      {item.number}
                    </span>
                    {item.number !== '03' && (
                      <div className="absolute top-12 bottom-[-2rem] left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-primary/30 to-transparent hidden sm:block" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-lg mb-2 group-hover/item:text-primary transition-colors">{item.title}</h5>
                    <p className="text-sm text-white/50 leading-relaxed group-hover/item:text-white/70 transition-colors">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Goal/Path Card - Span 2 */}
        <AnimatedSection preset="slideRight" className="lg:col-span-2">
          <div className="glow-card h-full p-10 flex flex-col justify-between group/path overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,119,255,0.1),transparent_60%)]" />
            
            <div className="relative space-y-6">
              <div className="space-y-2">
                <h4 className="font-bold text-[10px] uppercase tracking-[0.4em] text-primary/80">
                  The Next Chapter
                </h4>
                <h3 className="text-4xl font-black text-white leading-[1.1]">
                  Technical <br />
                  <span className="text-gradient">Artist</span> Path
                </h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-lg text-white/70 leading-relaxed font-light">
                  Aiming to master the <span className="text-white font-bold underline underline-offset-8 decoration-primary/30">Graphic Pipeline</span> and write <span className="text-white font-bold underline underline-offset-8 decoration-primary/30">Custom Shaders</span>. 
                </p>
                <p className="text-white/50 leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1 text-sm">
                  Focusing on performance optimization to deliver AAA-quality game experiences on mobile platforms.
                </p>
              </div>
            </div>
            
            <div className="relative pt-10 flex gap-2 flex-wrap">
              {['Shader Coding', 'Performance Fix', 'VFX Pipeline', 'Optimization'].map((tag, idx) => (
                <motion.span 
                  key={tag} 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(0,119,255,0.5)', color: '#fff' }}
                  className="text-[9px] font-black px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 uppercase tracking-widest transition-all cursor-default"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

export default AboutMe;

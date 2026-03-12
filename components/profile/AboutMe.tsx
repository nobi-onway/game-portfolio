'use client';
import { motion } from 'framer-motion';
import { AnimatedSection, AnimatedItem } from '@/components/common/AnimatedSection';

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
    <section className="mx-auto mt-20 px-4 lg:w-[900px] lg:px-0" id="about-me">

      {/* ── Header ── */}
      <AnimatedSection preset="fadeUp" className="mb-16 text-center">
        <h2 className="section-label mb-4">The Visionary</h2>
        <h3 className="text-4xl md:text-5xl font-bold mb-6">Đoàn Gia Bảo</h3>
        <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto italic">
          &ldquo;Realism to solve problems, Minimalism to optimize performance, Decisiveness to achieve the best
          quality.&rdquo;
        </p>
      </AnimatedSection>

      {/* ── Philosophy & Secret Weapon ── */}
      <div className="grid md:grid-cols-2 gap-10 items-start mb-24">

        {/* Philosophy card */}
        <AnimatedSection preset="slideLeft">
          <div className="rounded-xl border border-[var(--border)] overflow-hidden" style={{ background: 'linear-gradient(160deg, rgba(0,119,255,0.06) 0%, rgba(10,10,18,0.95) 100%)' }}>
            {/* Gradient top accent */}
            <div className="h-[2px] w-full" style={{ background: 'var(--gradient-primary)' }} />
            <div className="p-8">
              <h4 className="text-xl font-bold mb-6 text-white">
                Philosophy &amp; Personality
              </h4>
              <AnimatedSection stagger className="space-y-5">
                {PHILOSOPHY.map((item) => (
                  <AnimatedItem key={item.number} preset="fadeUp">
                    <div className="flex gap-4 items-start">
                      <span className="font-mono text-xs font-bold text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-2 py-1 rounded-md flex-shrink-0 mt-0.5">
                        {item.number}
                      </span>
                      <p className="text-sm text-white/75 leading-relaxed">
                        <b className="text-white">{item.title}:</b> {item.body}
                      </p>
                    </div>
                  </AnimatedItem>
                ))}
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>

        {/* Secret Weapon */}
        <AnimatedSection preset="slideRight" className="flex flex-col gap-6">
          <div>
            <h4 className="text-2xl font-bold mb-3">Secret Weapon</h4>
            <p className="text-[var(--text-muted)] leading-relaxed text-sm">
              A constant curiosity about game mechanics and a desire to bridge the gap between graphics and source
              code. I don&apos;t just want the game to &ldquo;run&rdquo;; I want it to be &ldquo;beautiful and
              smooth&rdquo;.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glow-card p-5 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.45 }}
                whileHover={{ scale: 1.03 }}
              >
                <h5 className="text-[var(--primary)] font-bold text-sm mb-1">{stat.label}</h5>
                <p className="text-xs text-[var(--text-muted)]">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      {/* ── Goal banner ── */}
      <AnimatedSection preset="fadeUp">
        <div className="relative rounded-xl overflow-hidden border border-[var(--primary)]/20 p-6">
          {/* Gradient left border accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ background: 'var(--gradient-primary)' }} />
          {/* Subtle radial glow behind */}
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full opacity-10 blur-3xl" style={{ background: 'var(--primary)' }} />

          <div className="relative pl-4">
            <h4 className="font-bold text-base uppercase tracking-wide mb-2">
              Goal for the next 2–3 years
            </h4>
            <p className="text-sm text-white/75 leading-relaxed">
              Developing into a professional{' '}
              <b className="text-white">Technical Artist</b>. Focusing on optimizing the Graphic Pipeline,
              writing Custom Shaders, and performance optimization to create high-quality AAA game experiences
              on Mobile.
            </p>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}

export default AboutMe;

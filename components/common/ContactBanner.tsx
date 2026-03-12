'use client';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

import FacebookIcon from '@/public/images/facebook.png';
import MailIcon from '@/public/images/mail.png';
import GithubIcon from '@/public/images/github.png';
import ItchIoIcon from '@/public/images/itchio.png';

const contacts: { label: string; href: string; src: StaticImport }[] = [
  { label: 'Facebook', href: 'https://www.facebook.com/doangiabao27', src: FacebookIcon },
  { label: 'Email', href: 'mailto:doangiabao.dev@gmail.com', src: MailIcon },
  { label: 'GitHub', href: 'https://github.com/nobi-onway', src: GithubIcon },
  { label: 'Itch.io', href: 'https://nobi-onway.itch.io/', src: ItchIoIcon },
];

function ContactBanner() {
  return (
    <section className="relative mt-20 px-4 mb-20">
      <div className="mx-auto max-w-[1000px] glass-card overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[100px] pointer-events-none" />
        
        <div className="relative px-8 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Call to action */}
          <div className="text-center md:text-left space-y-4 max-w-lg">
            <motion.h4 
              className="text-3xl md:text-4xl font-bold tracking-tight text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Let&apos;s Build the <span className="text-gradient">Next Big Thing</span> Together
            </motion.h4>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm mx-auto md:mx-0">
              I&apos;m currently open to collaborations, game development internships, and full-time opportunities.
            </p>
          </div>

          {/* Connected accounts */}
          <div className="flex flex-col items-center md:items-end gap-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">
              Connect With Me
            </span>
            <div className="flex gap-4">
              {contacts.map((contact, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link
                    href={contact.href}
                    target="_blank"
                    className="group relative block p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors shadow-2xl"
                    title={contact.label}
                  >
                    <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative size-6">
                      <Image
                        className="object-contain filter brightness-90 group-hover:brightness-110 transition-all"
                        alt={contact.label}
                        fill
                        src={contact.src}
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactBanner;

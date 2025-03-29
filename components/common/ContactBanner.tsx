import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import Link from 'next/link';

import FacebookIcon from '@/public/images/facebook.png';
import MailIcon from '@/public/images/mail.png';
import GithubIcon from '@/public/images/github.png';
import ItchIoIcon from '@/public/images/itchio.png';

const contacts: { href: string; src: StaticImport }[] = [
  {
    href: 'https://www.facebook.com/doangiabao27',
    src: FacebookIcon,
  },
  {
    href: 'mailto:doangiabao.dev@gmail.com',
    src: MailIcon,
  },
  {
    href: 'https://github.com/nobi-onway',
    src: GithubIcon,
  },
  {
    href: 'https://nobi-onway.itch.io/',
    src: ItchIoIcon,
  },
];

function ContactBanner() {
  return (
    <section className="mt-12 bg-[#191a1c] lg:h-32">
      <div className="mx-auto h-full lg:w-[766px]">
        <div className="float-left flex h-full flex-col items-center justify-center gap-2">
          <span className="font-bold tracking-widest uppercase">
            Let&apos;s Connect!
          </span>
          <span className="text-center text-xs opacity-60">
            I&apos;m open to collaborations, internships, and full-time
            opportunities.
          </span>
          <span className="text-center text-xs opacity-60">
            Let&apos;s create something amazing together!
          </span>
        </div>
        <div className="float-right flex h-full flex-col items-center justify-center">
          <span className="font-bold tracking-widest uppercase opacity-60">
            Follow me on
          </span>
          <ul className="my-2 flex gap-4">
            {contacts.map((contact, index) => {
              const { href, src } = contact;

              return (
                <li key={index}>
                  <Link
                    href={href}
                    className="rounded-md border-transparent shadow-2xl shadow-white"
                  >
                    <div className="relative size-5 rounded-md">
                      <Image
                        className="object-cover"
                        alt="fb-icon"
                        fill
                        src={src}
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ContactBanner;

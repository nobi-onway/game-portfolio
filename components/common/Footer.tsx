import { Copyright } from 'lucide-react';

function Footer() {
  return (
    <footer className="h-16 bg-[#141516] shadow-2xl">
      <span className="flex h-full w-full items-center justify-center gap-0.5 text-[9px] opacity-20">
        <Copyright size={9} />
        <span>2025 NOBI-ONWAY Game Developer</span>
      </span>
    </footer>
  );
}

export default Footer;

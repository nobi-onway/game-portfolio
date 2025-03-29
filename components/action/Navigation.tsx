import Link from 'next/link';
import React from 'react';
import IconButton from '../common/IconButton';

import { Kanit } from 'next/font/google';

const TitleFont = Kanit({
  variable: '--font-title',
  subsets: ['latin'],
  weight: '500',
});

const tags = ['about me', 'games'];
// const tags = ['about me', 'academic path', 'career path', 'games'];

const Navigation = () => {
  return (
    <nav className="shadow-[rgb(0 0 0 / 25%)] fixed z-[999] h-14 w-full min-w-96 bg-[#212224] px-6 text-white shadow-2xl">
      <div className="float-left flex h-full items-center">
        <Link
          className={`${TitleFont.className} mr-4 text-xl tracking-wider uppercase`}
          href="/"
        >
          Portfolio
        </Link>

        {tags.map((tag, index) => {
          return (
            <Link
              className="ml-5 px-2 text-xs uppercase opacity-60 duration-500 ease-in-out hover:opacity-100"
              key={index}
              href={'#' + tag.split(' ').join('-')}
            >
              {tag}
            </Link>
          );
        })}
      </div>
      <div className="float-right flex h-full items-center gap-4">
        <IconButton icon="react" label="React" />
        <IconButton icon="unity" label="Unity" />
      </div>
    </nav>
  );
};

export default Navigation;

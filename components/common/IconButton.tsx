'use client';
import Image from 'next/image';

import UnityIcon from '@/public/images/unity.png';
import ReactIcon from '@/public/images/react.png';
import WindowsIcon from '@/public/images/windows.png';
import Button, { ButtonPropsType } from './Button';

type IconButtonPropsType = {
  icon: 'unity' | 'react' | 'windows';
} & ButtonPropsType;

const NameToIcon = {
  unity: UnityIcon,
  react: ReactIcon,
  windows: WindowsIcon,
};

function IconButton(props: IconButtonPropsType) {
  const { label, onClick, icon } = props;

  return (
    <Button label={label} onClick={onClick}>
      <div className="relative size-4 overflow-hidden">
        <Image fill alt="icon" src={NameToIcon[icon]} />
      </div>
    </Button>
  );
}

export default IconButton;

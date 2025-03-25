import { ReactNode } from 'react';

const TypeToHighlight: Record<string, string> = {
  fill: 'bg-primary border-transparent opacity-90',
  outline: 'opacity-60',
};

export type ButtonPropsType = {
  label: string;
  onClick?: () => void;
  type?: 'fill' | 'outline';
} & { children?: ReactNode };

function Button(props: ButtonPropsType) {
  const { label, onClick, children, type = 'fill' } = props;

  const clickable = onClick != null;
  const clickableClassName = 'hover:cursor-pointer';

  const highlightClassName = TypeToHighlight[type];

  return (
    <button
      onClick={() => onClick?.()}
      className={`${highlightClassName} flex items-center gap-2 rounded-md border px-3.5 py-2 uppercase transition-all duration-300 ease-in-out hover:opacity-100 ${clickable && clickableClassName}`}
    >
      {children}
      <label
        className={`text-[10px] font-semibold opacity-90 transition-all duration-300 ease-in-out hover:opacity-100 ${clickable && clickableClassName}`}
      >
        {label}
      </label>
    </button>
  );
}

export default Button;

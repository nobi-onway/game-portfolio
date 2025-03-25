import { Box, LayoutGrid, LucideProps, Square } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

type TagPropsType = {
  selected?: boolean | false;
  type: 'All' | '2D' | '3D';
  label: string;
};

const TypeToIcon: Record<
  string,
  ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
> = {
  All: LayoutGrid,
  '2D': Square,
  '3D': Box,
};

function Tag(props: TagPropsType) {
  const { selected, type, label } = props;

  const defaultClassName = 'opacity-60 border-white';
  const selectedClassName = 'border-transparent bg-primary';

  const Icon = TypeToIcon[type];

  return (
    <div
      className={`flex cursor-pointer items-center gap-1 rounded-full border p-2 transition-all duration-500 ease-in-out hover:opacity-100 ${selected ? selectedClassName : defaultClassName}`}
    >
      <Icon size={16} />
      <label className="cursor-pointer text-xs">{label}</label>
    </div>
  );
}

export default Tag;

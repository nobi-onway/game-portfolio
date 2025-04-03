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

  const Icon = TypeToIcon[type];

  return (
    <div
      data-selected={selected}
      className="data-[selected=true]:bg-primary flex cursor-pointer items-center gap-1 rounded-full border border-white p-2 opacity-60 transition-all duration-500 ease-in-out hover:opacity-100 data-[selected=true]:border-transparent data-[selected=true]:opacity-100"
    >
      <Icon className="size-5 lg:size-4" />
      <label className="hidden cursor-pointer lg:block lg:text-xs">
        {label}
      </label>
    </div>
  );
}

export default Tag;

import Tag from './Tag';

const types: { type: 'All' | '2D' | '3D'; label: string }[] = [
  {
    type: 'All',
    label: 'All Games',
  },
  {
    type: '2D',
    label: '2D Games',
  },
  {
    type: '3D',
    label: '3D Games',
  },
];

type FilterBarPropsType = {
  onSelectType: (type: 'All' | '2D' | '3D') => void;
  selectedType: 'All' | '2D' | '3D';
};

function FilterBar(props: FilterBarPropsType) {
  const { onSelectType, selectedType } = props;

  return (
    <section>
      <div className="float-left">
        <span className="text-xl">All Games</span>
      </div>
      <div className="float-right flex items-center gap-2">
        {types.map((t, index) => {
          const { type, label } = t;
          return (
            <button key={index} onClick={() => onSelectType(type)}>
              <Tag type={type} label={label} selected={selectedType === type} />
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default FilterBar;

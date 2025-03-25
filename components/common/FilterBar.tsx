import Tag from './Tag';

function FilterBar() {
  return (
    <section>
      <div className="float-left">
        <span className="text-xl">All Games</span>
      </div>
      <div className="float-right flex items-center gap-2">
        <Tag type="All" label="All Games" selected />
        <Tag type="2D" label="2D Games" />
        <Tag type="3D" label="3D Games" />
      </div>
    </section>
  );
}

export default FilterBar;

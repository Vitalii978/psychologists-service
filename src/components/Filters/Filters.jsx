import './Filters.css';

const Filters = ({ sortOption, setSortOption }) => {
  return (
    <div className="filters-section">
      <div className="filters-label">Filters</div>
      <div className="filter-select-wrapper">
        <select
          className="filter-select"
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
        >
          <option value="show-all">Show all</option>
          <option value="a-to-z">A to Z</option>
          <option value="z-to-a">Z to A</option>
          <option value="less-to-greater">Less to greater</option>
          <option value="greater-to-less">Greater to less</option>
          <option value="popular">Popular</option>
          <option value="not-popular">Not popular</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;

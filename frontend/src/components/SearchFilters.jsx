function SearchFilters({ filters, setFilters, onSearch }) {
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="filters">
      <input
        name="search"
        placeholder="Search condo, gym, downtown..."
        value={filters.search}
        onChange={handleChange}
      />

      <input
        name="minPrice"
        placeholder="Min price"
        value={filters.minPrice}
        onChange={handleChange}
      />

      <input
        name="maxPrice"
        placeholder="Max price"
        value={filters.maxPrice}
        onChange={handleChange}
      />

      <select name="bedrooms" value={filters.bedrooms} onChange={handleChange}>
        <option value="">Bedrooms</option>
        <option value="0">Studio</option>
        <option value="1">1 Bedroom</option>
        <option value="2">2 Bedrooms</option>
        <option value="3">3 Bedrooms</option>
      </select>

      <select name="bathrooms" value={filters.bathrooms} onChange={handleChange}>
        <option value="">Bathrooms</option>
        <option value="1">1 Bathroom</option>
        <option value="2">2 Bathrooms</option>
      </select>

      <select name="sort" value={filters.sort} onChange={handleChange}>
        <option value="">Newest</option>
        <option value="price_asc">Price Low to High</option>
        <option value="price_desc">Price High to Low</option>
        <option value="best_match">Best Match</option>
      </select>

      <button onClick={onSearch}>Search</button>
    </div>
  );
}

export default SearchFilters;
const SearchBar = ({ search, setSearch }) => {
    return (
        <input
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by word or meaning..."
        />
    );
};

export default SearchBar;

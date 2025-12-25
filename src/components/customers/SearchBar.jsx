const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search customers..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: 12,
        fontSize: 16,
        marginBottom: 16
      }}
    />
  );
};

export default SearchBar;

const ReviewSearchBar = ({ searchQuery, onSearchChange, sortOrder, onSortChange }) => {
  return (
    <div className="flex justify-between items-center mt-4 mb-2">
      <input
        type="text"
        placeholder="Search by book title or user..."
        className="border border-gray-300 rounded-md px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        className="ml-4 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="latest">Sort by Latest</option>
        <option value="oldest">Sort by Oldest</option>
      </select>
    </div>
  );
};

export default ReviewSearchBar;

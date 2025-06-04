const ReviewSearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="flex justify-center items-center mt-4 mb-2">
      <input
        type="text"
        placeholder="Search by Book Title or User..."
        className="border border-gray-300 rounded-md px-4 py-2 w-[70%] focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      
    </div>
  );
};

export default ReviewSearchBar;

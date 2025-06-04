const ReviewSearchBar = ({ searchQuery, onSearchChange, className }) => {
  return (
    <div className="flex justify-center items-center mt-4 mb-2">
      <input
        type="text"
        placeholder="Search by Book Title or User..."
        className={`w-full max-w-xs sm:max-w-2xl  border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${className}`}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      
    </div>
  );
};

export default ReviewSearchBar;

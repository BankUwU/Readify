import React from "react";

function Bookreview({ bookreview }) {
  return (
    <div className="book-list-page">
      <div className="book-grid space-y-6">
        {bookreview.map((item) => (
          <div key={item.id} className="flex flex-row">
            <img
              src={item.imageurl}
              alt={item.title}
              className="w-48 h-72 object-cover border-l-2 border-gray-200"
            />
            <div className="p-4 flex-grow text-gray-800">
              <h2 className="text-2xl m-0 text-[#2c3e50]">{item.title}</h2>
              <h2 className="text-xl mt-2 text-purple-700">{item.category}</h2>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bookreview;

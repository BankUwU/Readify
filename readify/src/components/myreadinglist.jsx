import React from "react";

function MyReadingList({ readingList }) {
  return (
    <div className="mt-8">
      <div className="flex flex-wrap justify-center cursor-pointer">
        {readingList.map((item) => (
          <div
            key={item.id}
            className="bg-white p-2 rounded-2xl shadow-md transition-transform duration-200 hover:-translate-y-1 flex flex-col items-center w-[190px] h-[272px]"
          >
            <img
              src={item.booksCover}
              alt={item.title}
              className="w-[150px] h-[220px] object-cover rounded-lg mb-1 mt-1 mx-auto block"
            />
            <div className="text-center w-full">
              <h2 className="text-lg text-[#222] mb-1">{item.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyReadingList;

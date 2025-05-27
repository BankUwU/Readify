import React from "react";
import { ReactComponent as PlusSign } from "../img/plus-sign.svg";

function Plus() {
  return (
    <div className="p-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 cursor-pointer">
        <div className="bg-white p-10 min-h-[262px] rounded-2xl shadow-md flex flex-col items-center justify-center transition-transform duration-200 hover:-translate-y-1">
          <PlusSign 
             className="w-24 h-20 text-gray-600 fill-current transition-transform duration-200 rounded-lg" 
          />
        </div>
      </div>
    </div>
  );
}

export default Plus;

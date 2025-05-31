import React from "react";
import { ReactComponent as PlusSign } from "../img/plus-sign.svg";

function Plus() {
  return (
    <div className="p-8">
      <div className="cursor-pointer">
        <div className="bg-white p-10 h-[272px] w-[190px] rounded-2xl shadow-md flex flex-col items-center justify-center transition-transform duration-200 hover:-translate-y-1">
          <PlusSign 
             className="w-24 h-20 text-gray-600 fill-current transition-transform duration-200 rounded-lg" 
          />
        </div>
      </div>
    </div>
  );
}

export default Plus;

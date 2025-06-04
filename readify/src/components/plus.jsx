import React from "react";
import { ReactComponent as PlusSign } from "../img/plus-sign.svg";

function Plus({onClick}) {
  return (
    <div className="p-4 sm:p-8">
      <div className="cursor-pointer">
        <div className="bg-white p-6 sm:p-10 h-[120px] w-[80px] sm:h-[272px] sm:w-[190px] rounded-2xl shadow-md flex flex-col items-center justify-center transition-transform duration-200 hover:-translate-y-1">
          <PlusSign 
            onClick={onClick}
            className="w-14 h-10 sm:w-24 sm:h-20 text-gray-600 fill-current transition-transform duration-200 rounded-lg" 
          />
        </div>
      </div>
    </div>
  );
}

export default Plus;

import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";

function CreateEditShop() {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);
  console.log(myShopData);
  return (
    <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen">
      <div
        className="absolute top-[20px] left-[20px] z-[10] mb-[10px]"
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
      </div>
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <FaUtensils className="text-[#ff4d2d] w-16 h-16" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900">
            {" "}
            {myShopData ? "Edit Shop" : "Add Shop"}
          </div>
        </div>
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter Shop Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Image
            </label>
            <input
              type="file"
              placeholder="Enter Shop Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEditShop;

import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

function CreateEditShop() {
  const navigate = useNavigate();

  return (
    <div className='flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen'>
      
      <div
        className='absolute top-[20px] left-[20px] z-[10] mb-[10px]'
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack
          size={35}
          className='text-[#ff4d2d]'
        />
      </div>
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100"></div>

    </div>
  )
}

export default CreateEditShop
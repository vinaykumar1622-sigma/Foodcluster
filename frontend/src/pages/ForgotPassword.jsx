import axios from "axios";
import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { CircleLoader } from "react-spinners";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      );
      console.log(result.data);
      setErr("");
      setStep(2);
    } catch (error) {
      setErr(error?.response?.data?.message);
    } finally {
      setLoading(false); 
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      console.log(result);
      setErr("");
      setStep(3);
    } catch (error) {
      setErr(error?.response?.data?.message);
    } finally {
      setLoading(false); 
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, newPassword },
        { withCredentials: true }
      );
      console.log(result);
      setErr("");
      navigate("/signin");
    } catch (error) {
      setErr(error?.response?.data?.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className='flex w-full items-center justify-center min-h-screen p-4 bg-["#fff9f6"]'>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <IoMdArrowRoundBack
          size={30}
          className=" text-[#ff4d2d]"
          onClick={() => navigate("/signin")}
        />
        <h1 className="text-2xl font-bold text-center text-[#ff4d2d]">
          Forgot Password
        </h1>

        {step == 1 && (
          <div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 mb-4">
                Email
              </label>
              <input
                type="email"
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus: outline-none"
                placeholder="Enter your Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <button
              type="button"
              className="w-full font-semibold rounded-lg py-2 bg-[#ff4d2d] text-white"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? <CircleLoader size={20} color="#fff" /> : "Send OTP"}
            </button>

            {err && <p className="text-red-500 text-center mb-2">* {err}</p>}
          </div>
        )}

        {step == 2 && (
          <div>
            <div className="mb-6">
              <label htmlFor="otp" className="block text-gray-700 mb-4">
                OTP
              </label>
              <input
                type="text"
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter your OTP"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
              />
            </div>

            {err && <p className="text-red-500 text-center mb-2">* {err}</p>}

            <button
              type="button"
              className="w-full font-semibold rounded-lg py-2 bg-[#ff4d2d] text-white"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? <CircleLoader size={20} color="#fff" /> : "Verify"}
            </button>
          </div>
        )}

        {step == 3 && (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-4">
                New Password
              </label>
              <input
                type="password"
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter your New Password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-4">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter your Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>

            <button
              type="button"
              className="w-full font-semibold rounded-lg py-2 bg-[#ff4d2d] text-white"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? <CircleLoader size={20} color="#fff" /> : "Reset Password"}
            </button>

            {err && <p className="text-red-500 text-center mb-2">* {err}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;


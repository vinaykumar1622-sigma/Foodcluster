import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { CircleLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignIn() {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false); 
  const dispatch = useDispatch()

  const handleSignIn = async () => {

    setLoading(true); // ✅ FIX

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data))
      setErr("");
    } catch (error) {
      setErr(error?.response?.data?.message);
    } finally {
      setLoading(false); 
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      if (!result.user || !result.user.email) {
        throw new Error("Google sign-in did not return email");
      }

      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        { email: result.user.email },
        { withCredentials: true },
      );
      dispatch(setUserData(data))

      console.log("Server response:", data);
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        console.warn("User closed the popup before completing sign-in");
      } else if (error.code === "auth/cancelled-popup-request") {
        console.warn(
          "Popup request was cancelled due to another ongoing request",
        );
      } else if (error.response) {
        console.error("Server error:", error.response.data);
      } else {
        console.error("Client error:", error.message);
      }
    }
  };

  return (
    <div
      className="min-h-screen  w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px]`}
        style={{
          border: `1px solid ${borderColor}`,
        }}
      >
        <h1
          className={`text-3xl font-bold mb-2`}
          style={{ color: primaryColor }}
        >
          Foodcluster
        </h1>
        <p className="text-gray-600 mb-8 ">
          Sign In your Account to get started with delicious food deliveries{" "}
        </p>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-4">
            Email
          </label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2 focus: outline-none "
            placeholder="Enter your Email"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-4">
            Password
          </label>
          <div className="relative">
            <input
              type={`${showPassword ? "text" : "password"}`}
              className="w-full border rounded-lg px-3 py-2 focus: outline-none "
              placeholder="Enter your Password"
              style={{ border: `1px solid ${borderColor}` }}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button
              type="button" 
              className="absolute right-3 top-[14px] text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
        </div>

        <div
          className="text-right mb-4 text-[#ff4d2d] font-medium cursor-pointer"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password
        </div>

        {err && <p className="text-red-500 text-center mb-2">* {err}</p>}

        <div className="mt-6">
          <button
            type="button"
            className="w-full font-semibold rounded-lg py-2 transition duration-200 cursor-pointer bg-[#ff4d2d] text-white hover:bg-[#e64323]"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? <CircleLoader size={20} color="#fff"/> : "Sign In"}
          </button>
        </div>

        <button
          className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200  hover:bg-gray-100 cursor-pointer border-gray-400"
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={20} />
          <span>Sign in with google</span>
        </button>

        <p
          className="w-full text-center mt-2 cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Want to create a new account ?{" "}
          <span className="text-[#ff2d4d]">Sign up</span>{" "}
        </p>
      </div>
    </div>
  );
}

export default SignIn;


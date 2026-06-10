import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { CircleLoader } from "react-spinners"
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignUp() {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const handleGoogleAuth = async () => {
    if (!mobile) {
      setErr("Mobile number is required!");
      return;
    }
    setLoading(true);

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          mobile,
          role,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(data))

      console.log("Server response:", data);
      setErr("");
      setLoading(false)
    } catch (error) {
      setErr(error?.response?.data?.message || "Google auth failed");
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!fullName) {
      setErr("Full Name is required");
      return;
    }

    if (!email) {
      setErr("Email is required");
      return;
    }

    if (!mobile) {
      setErr("Mobile number is required");
      return;
    }

    if (mobile.length !== 10) {
      setErr("Mobile must be 10 digits");
      return;
    }

    if (!password) {
      setErr("Password is required");
      return;
    }

    setLoading(true); 

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          fullName,
          email,
          mobile,
          password,
          role,
        },
        { withCredentials: true },
      );

      dispatch(setUserData(result.data))
      setErr("");
      if (result.data.success) {
        navigate("/signin");
      }
    } catch (error) {
      setErr(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); 
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
          Create your account to get started with delicious food deliveries{" "}
        </p>

        {/* fullname */}
        <div className="mb-4">
          <label htmlFor="fullname" className="block text-gray-700 mb-4">
            Full Name
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus: outline-none "
            placeholder="Enter your Full Name"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
          />
        </div>

        {/* email */}
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

        {/* mobile */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-4">Mobile No</label>
          <div className="flex">
            <span
              className="px-3 py-2 border rounded-l-lg bg-gray-100"
              style={{ border: `1px solid ${borderColor}` }}
            >
              +91
            </span>

            <input
              type="tel"
              maxLength={10}
              placeholder="Enter mobile number"
              className="w-full rounded-r-lg px-3 py-2 focus:outline-none"
              style={{ border: `1px solid ${borderColor}` }}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setMobile(value);
              }}
              value={mobile}
            />
          </div>
        </div>

        {/* password */}
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

        {/* Role */}
        <div className="mb-4">
          <label htmlFor="role" className="block text-gray-700 mb-4">
            Role
          </label>

          <div className="flex gap-2">
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button
                key={r}
                type="button"
                className="flex-1 border rounded-lg px-3 py-2 text-center cursor-pointer font-medium"
                onClick={() => setRole(r)}
                style={
                  role === r
                    ? { backgroundColor: primaryColor, color: "white" }
                    : {
                        border: `1px solid ${primaryColor}`,
                        color: primaryColor,
                      }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* error */}
        {err && <p className="text-red-500 text-center mb-2">* {err}</p>}

        <div className="mt-6">
          <button
            type="button"
            className="w-full font-semibold rounded-lg py-2 transition duration-200 cursor-pointer bg-[#ff4d2d] text-white hover:bg-[#e64323]"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? <CircleLoader size={20} color="#fff" /> : "Sign Up"}
          </button>
        </div>

        <button
          className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 hover:bg-gray-100 cursor-pointer border-gray-400"
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={20} />
          <span>Sign Up with Google</span>
        </button>

        <p
          className="w-full text-center mt-2 cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Already have an account ?{" "}
          <span className="text-[#ff2d4d]">Sign In</span>{" "}
        </p>
      </div>
    </div>
  );
}

export default SignUp;


import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../utilles/token.js";
import { sendOtpMail } from "../utilles/mail.js";

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;

    if (!fullName || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    if (mobile.length !== 10) {
      return res
        .status(400)
        .json({ message: "Mobile number must be 10 digits." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      fullName,
      email,
      mobile,
      role,
      password: hashedPassword,
    });

    const token = genToken(user._id);

    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(201).json({
      success: true,
      message: "User created!",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: `sign up error ${error}` });
  }
};
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = genToken(user._id);

    res.cookie("token", token, {
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const { password: _, ...userData } = user._doc;

    return res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    return res.status(500).json({ message: `sign In error ${error}` });
  }
};
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successfully ! " });
  } catch (error) {
    return res.status(500).json({ message: `sign out error ${error}` });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User dose not exists!" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;
    await user.save();
    await sendOtpMail(email, otp);
    return res.status(200).json({ message: "Otp Send successfully ! " });
  } catch (error) {
    return res.status(500).json({ message: `Otp Send error ${error}` });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.resetOtp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid/Expired Otp!" });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Incorrect Otp!" });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Otp verified successfully!" });
  } catch (error) {
    return res.status(500).json({ message: `Otp verify error: ${error.message}` });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "Verification required!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    return res.status(500).json({ message: `Password reset error: ${error.message}` });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { fullName, email, mobile, role } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), 10);

      user = await User.create({
        fullName,
        email,
        mobile,
        role,
        password: dummyPassword,
        authProvider: "google"
      });
    }

    const token = genToken(user._id);

    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    // safer way to strip password
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({
      success: true,
      user: userObj
    });
  } catch (error) {
    return res.status(500).json({ message: `GoogleAuth error: ${error.message}` });
  }
};
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() {
      return this.authProvider === "local";
    }
  },
  mobile: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "owner", "deliveryBoy"],
    required: true
  },
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },
  googleId: { type: String },
  profilePic: { type: String },
  resetOtp: { type: String },
  isOtpVerified: { type: Boolean, default: false },
  otpExpires: { type: Date }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
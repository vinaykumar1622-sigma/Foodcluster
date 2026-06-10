import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
const uploadOnCloudinary = async (flie) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDNINARY_CLOUD_NAME,
    api_key: process.env.CLOUDNINARY_API_KEY,
    api_secret: process.env.CLOUDNINARY_API_SECRET,
  });
  try {
    const result = await cloudinary.uploader.upload(flie);
    fs.unlinkSync(flie);
    return result.secure_url;
  } catch (error) {
    fs.unlinkSync(flie);
    console.log(error);
  }
};
export default uploadOnCloudinary;

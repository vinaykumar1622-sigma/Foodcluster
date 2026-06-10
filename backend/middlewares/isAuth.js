import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Token not found!" });
    }

    let decodeToken;

    try {
      decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

   req.userId = decodeToken.userId; 

    next();
  } catch (error) {
    return res.status(500).json({ message: `isAuth error ${error}` });
  }
};
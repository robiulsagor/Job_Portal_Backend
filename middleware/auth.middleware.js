import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token)
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access, Token Verification Failed",
      });
    }

    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
};

export default isAuth;

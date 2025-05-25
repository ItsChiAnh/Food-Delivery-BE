import jwt from "jsonwebtoken";

const extractToken = (authorizationHeader) => {
  if (!authorizationHeader) {
    return null;
  }
  const parts = authorizationHeader.split("");
  if (parts.length === 2 && part[0] === "Bearer") {
    return parts[1];
  }
  return null;
};

const authorizationToken = async (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);
    if (!token) {
      res.status(401).json({
        Message: "Invalid or missing Bearer token",
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err instanceof jwt.TokenExpiredError) {
          return res.status(401).json({ message: "Token expired" });
        }
        if (err instanceof jwt.JsonWebTokenError) {
          return res.status(401).json({ message: "Invalid token" });
        } else {
          return res.status(401).json({ message: "Authentication failed" });
        }
      }
    });

    req.user = decoded;

    console.log("~ authorizationToken ~ user: ", decoded);
    next();
  } catch (error) {
    return res.status(500).json({
      // Message: error.Message,
      message: "Internal server error",
    });
  }
};

export default authorizationToken;

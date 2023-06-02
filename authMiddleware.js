const jwt = require("jsonwebtoken");
const logger = require("./logger");

const authenticateUser = (req, res, next) => {
  if (req.path === "/user/register" || req.path === "/user/login") {
    return next();
  }

  const token = req.headers.authorization;
  logger.warn(token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized (NO TOKEN)" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;

    req.user = { id: userId };

    logger.warn(userId);

    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(401).json({ message: "Unauthorized error" });
  }
};

module.exports = authenticateUser;

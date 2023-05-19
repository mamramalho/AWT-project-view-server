const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(
      token,
      "18469576cd2c92ae2c59ca32ac5132682f8b00472d76d16fe41a1126892a36b6"
    );
    const { userId } = decodedToken;

    req.user = { id: userId };

    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authenticateUser;

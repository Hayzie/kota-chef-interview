import jwt from "jsonwebtoken";

export const verifyToken = async (c: any) => {
  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader) {
      return { error: "Authorization header missing", status: 401 };
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return { error: "Token missing", status: 401 };
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not defined in the environment.");
      return { error: "Server configuration error", status: 500 };
    }

    const decoded = jwt.verify(token, secret);
    console.log("Token decoded:", decoded);

    return { decoded, status: 200 };
  } catch (error) {
    console.error("Token verification error:", error);
    return { error: "Invalid or expired token", status: 403 };
  }
};

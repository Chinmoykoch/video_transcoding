import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Check header 
  if (!authHeader || typeof authHeader !== "string") {
    return res.status(401).json({
      message: "Authorization header missing",
    });
  }

  // Check Bearer 
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  //  Extract token
  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    // Attach decoded data to request
    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

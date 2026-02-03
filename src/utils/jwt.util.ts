import jwt from "jsonwebtoken";
import { TOKEN_EXPIRES_IN } from "../utils/app.constants";

export const signToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: TOKEN_EXPIRES_IN,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

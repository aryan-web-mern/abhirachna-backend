import jwt, { Secret } from "jsonwebtoken";

interface JwtPayload {
  id: string;
}



export const createToken = (user:any, sessionId: string=""): string => {
  const payload:any= { id: user._id, sessionId };

  const secret: any= process.env.JWT_SECRET!;
  const expiresIn:any = process.env.JWT_EXPIRES_IN || "1d";

  return jwt.sign(payload, secret, { expiresIn });
};

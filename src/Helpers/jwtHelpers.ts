import jwt, { JwtPayload, Secret } from "jsonwebtoken";

export const generateToken = async (
  payload: any,
  secret: string,
  tokenType: string
) => {
  const token = await jwt.sign(payload!, secret!, {
    expiresIn:
      tokenType === "access" ? "1d" : tokenType === "refresh" ? "30d" : "3m",
  });
  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  const tokenWithoutQuotes = token.replace(/^"|"$/g, "");

  const verifiedUser = jwt.verify(tokenWithoutQuotes, secret) as JwtPayload;

  return verifiedUser;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};

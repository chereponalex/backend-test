import jwt, { SignOptions } from 'jsonwebtoken';
import fs from 'fs';

export const signJwt = (
  payload: Object,
  options?: SignOptions
) => {
  const  privateKEY  = fs.readFileSync('./private.key', 'utf8');
  return jwt.sign(payload, privateKEY, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verifyJwt = <T>(
  token: string,
): T | null => {
  try {
    const  publicKEY  = fs.readFileSync('./public.key', 'utf8');
    const decoded = jwt.verify(token, publicKEY) as T;

    return decoded;
  } catch (error) {
    return null;
  }
};

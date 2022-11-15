import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { verify, decode } from 'jsonwebtoken';

const getToken = (token: string): string => {
  const isMatch = token.match(/^Bearer (.*)$/);
  if (!isMatch || isMatch.length < 2)
    throw new HttpException(
      { message: 'Invalid Token!' },
      HttpStatus.UNAUTHORIZED,
    );
  return isMatch[1];
};

const decodeToken = (token: string): any => {
  const decode = verify(token, process.env.SECRET_KEY);
  if (!decode)
    throw new HttpException(
      { message: 'Invalid Bearer Auth Token' },
      HttpStatus.UNAUTHORIZED,
    );
  return decode;
};

export const handleAuth = async ({ req }) => {
  try {
    if (req.headers.authorization) {
      const token = getToken(req.headers.authorization);
      const decoded: any = decodeToken(token);

      const payload = {
        userId: decoded.userId,
        permissions: decoded.permissions,
        authorization: req.headers.authorization,
      };

      return payload;
    }
  } catch (err) {
    throw new UnauthorizedException(
      'User unauthorized with invalid authorization Headers',
    );
  }
};

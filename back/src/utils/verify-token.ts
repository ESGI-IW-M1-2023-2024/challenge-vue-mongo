import jwt from 'jsonwebtoken';
import { myEnv } from '../../conf';

const VerifyJWTToken = (token: string): boolean => {
  try {
    jwt.verify(token, myEnv.secretKey);
    return true;
  } catch (e: any) {
    console.log(e);
    return false;
  }
};

export default VerifyJWTToken;

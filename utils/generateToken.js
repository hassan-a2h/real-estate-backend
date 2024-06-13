import jwt from 'jsonwebtoken';

const generateToken = (userInfo) => {
  return jwt.sign({ userInfo }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;

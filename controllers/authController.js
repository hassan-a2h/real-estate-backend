import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;

  const userExists = await User.findOne({ email });

  console.log('found user in db', userExists);
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  console.log('created user', user);
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken({ id: user._id, role: user.role }),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && user.password === password) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken({ id: user._id, role: user.role }),
      role: user.role,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Logged out successfully' });
});

const checkAuth = (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded', decoded);
    res.status(200).json({ id: decoded.userInfo.id, role: decoded.userInfo.role });
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

export { registerUser, authUser, logoutUser, checkAuth };

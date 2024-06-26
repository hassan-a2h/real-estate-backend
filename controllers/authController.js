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
    req.headers.userId = user._id;
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
  req.headers.userId = null;
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

const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
}

const getAgents = async (req, res) => {
  try {
    const agents = await User.aggregate([
      {
        $match: {
          role: 'agent'
        }
      },
      {
        $lookup: {
          from: 'socialmedias',
          localField: '_id',
          foreignField: 'user',
          as: 'socialMedia'
        }
      },
      {
        $project: {
          name: 1,
          role: 1,
          socialMedia: 1
        }
      }
    ]);

    if (agents) {
      return res.status(200).json(agents);
    } else {
      return res.status(404).json({ message: 'No agents found' });
    }
  } catch(error) {
    return res.status(500).json({ message: 'Error fetching agents', error });
  }
  
}

export { registerUser, authUser, logoutUser, checkAuth, getAgents, getUser };

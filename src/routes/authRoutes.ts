  import express, { Request, Response, NextFunction } from 'express';
  import { body, validationResult } from 'express-validator';
  import fetchUser from '../middleware/fetchUser';
  import User from '../models/userSchemas';
  import bcrypt from 'bcrypt';
  import jwt from 'jsonwebtoken';
  import dotenv from 'dotenv';

  // Load environment variables from .env file
  dotenv.config();

  const userRouter = express.Router();

  // Register Route
  userRouter.post(
    '/register',
    [
      body('username', 'Username must be at least 3 characters long').isLength({ min: 3 }),
      body('password', 'Password must be at least 5 characters long').isLength({ min: 5 }),
      body('email', 'Enter a valid email').isEmail(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        let user = await User.findOne({ username: req.body.username });
        if (user) {
          return res.status(400).json({ error: 'Username is already taken' });
        }

        user = await User.findOne({ email: req.body.email });
        if (user) {
          return res.status(400).json({ error: 'Email is already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = new User({
          username: req.body.username,
          email: req.body.email,
          password: secPass,
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully', user });
      } catch (error) {
        next(error);
      }
    }
  );

  // Login Route
  userRouter.post(
    '/login',
    [
      body('username', 'Username must be at least 3 characters long').isLength({ min: 3 }),
      body('password', 'Password cannot be blank').exists(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return res.status(400).json({ error: 'Invalid username or password' });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
          return res.status(400).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign(
          { user: { id: user._id, username: user.username } },
          process.env.JWT_SECRET || 'default_secret',
          { expiresIn: '1h' }
        );

        console.log('Generated Token:', token);  // Log the generated token

        res.status(200).json({ message: 'User logged in successfully', token, username: user.username });
      } catch (error) {
        next(error);
      }
    }
  );

  // Get User Route
  userRouter.post('/getuser', fetchUser, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(400).json({ error: 'User ID is missing' });
      }

      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
  userRouter.get('/getusername', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.query.username as string; // Retrieve the username from query parameters
        if (!username) {
            return res.status(400).json({ error: 'Username is required for search' });
        }

        const user = await User.findOne({ username }).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ error: 'Account Not Found' });
        }

        res.json({ message: 'User found', user });
    } catch (error) {
        console.error('Error searching user:', error);
        res.status(500).json({ error: 'Internal server error' });
        next(error);
    }
});

export default userRouter;
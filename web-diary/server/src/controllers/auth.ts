import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import UserType, { Activity } from "../types/user";
import passport from "../config/passport";
import ApiResponseType, { response } from "../types/response";
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ ...response, error: "All fields are required." });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ ...response, error: "User already exists with this email." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      activities: [new Activity("Created Account", req.headers['user-agent'])]
    } as UserType);
    await user.save(); 
    
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });

    res.status(201).json({
      ...response,
      success: true,
      data: {
        message: "User registered successfully",
        token, // Send JWT token
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          activities: user.activities
        }
      },
    });

  } catch (err: Error | any | null) {
    res.status(500).json({ ...response, error: err.message });
  }
};

export const login = (req: Request, res: Response) => {
  passport.authenticate("local", (err: Error | null, user: any, info: string | object | false | undefined) => {
      if (err) 
        return res.status(500).json({ ...response, error: "Internal server error" });
      
      if (!user) 
        return res.status(400).json({ ...response,  success: true, data: info });
      
      req.login(user, async (err) => {
        if (err)  
          return res.status(500).json({ ...response, error: "Failed to log in" });
        
        user.activities.unshift(new Activity("Logged in", req.headers['user-agent']));
        await user.save();

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });
        res.status(200).json({
          ...response,
          success: true,
          data: {
            message: "Logged in successfully",
            token,
            user: {
              _id: user._id,
              username: user.username,
              email: user.email,
              activities: user.activities
            }
          },
        });
      });
    }
  )(req, res);
};

export const logout = (req: Request, res: Response) => {
  res.status(200).json({
    ...response,
    success: true,
    data: { message: "Logged out successfully" },
  });
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ ...response, error: "No token provided" });
    }
    // Cast req.user to UserType if using TypeScript
    jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', async (err, decoded: any) => {
      if (err) {
        return res.status(401).json({ ...response, error: "Invalid token" });
      }

      const user = await User.findById(decoded.id).exec();
      if (!user) {
        return res.status(404).json({ ...response, error: "User not found" });
      }

      res.json({
        ...response,
        success: true,
        data: { user },
      });
    });
  } catch (err) {
    res.status(500).json({ ...response, error: "Internal server error" });
  }
};

export const changeUsername = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ ...response, error: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', async (err, decoded: any) => {
      if (err) {
        return res.status(401).json({ ...response, error: "Invalid token" });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ ...response, error: "User not found" });
      }

      const verified = await bcrypt.compare(password, user.password);
      if (!verified) {
        return res.status(400).json({ ...response, error: "Incorrect Password." });
      }

      const existingUser = await User.findOne({ username: username });
      if (existingUser) {
        return res.status(400).json({ ...response, error: "Username already taken." });
      }

      user.activities.unshift(new Activity(`Changed username from ${user.username} to ${username}`, req.headers['user-agent']));
      user.username = username;
      await user.save();

      return res.status(200).json({
        ...response,
        success: true,
        data: { user },
      });
    });
  } catch (err: Error | any) {
    return res.status(500).json({ ...response, error: err.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ ...response, error: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', async (err, decoded: any) => {
      if (err) {
        return res.status(401).json({ ...response, error: "Invalid token" });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ ...response, error: "User not found" });
      }

      const verified = await bcrypt.compare(currentPassword, user.password);
      if (!verified) {
        return res.status(400).json({ ...response, error: "Incorrect Password." });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      user.activities.unshift(new Activity("You changed your password", req.headers['user-agent']));
      await user.save();

      return res.status(200).json({
        ...response,
        success: true,
        data: { message: 'Password Changed Successfully.' }
      });
    });
  } catch (err: Error | any) {
    return res.status(500).json({ ...response, error: err.message });
  }
};

export const changeEmail = async (req: Request, res: Response) => {
  try {
    const { newEmail, password } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ ...response, error: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', async (err, decoded: any) => {
      if (err) {
        return res.status(401).json({ ...response, error: "Invalid token" });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ ...response, error: "User not found" });
      }

      const verified = await bcrypt.compare(password, user.password);
      if (!verified) {
        return res.status(400).json({ ...response, error: "Incorrect Password." });
      }

      const existingUser = await User.findOne({ email: newEmail });
      if (existingUser) {
        return res.status(400).json({ ...response, error: "Email Already in Use." });
      }

      user.activities.unshift(new Activity("Updated Email", req.headers['user-agent']));
      user.email = newEmail;
      await user.save();

      return res.status(200).json({
        ...response,
        success: true,
        data: { user },
      });
    });
  } catch (err: Error | any) {
    return res.status(500).json({ ...response, error: err.message });
  }
};
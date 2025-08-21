require('dotenv').config();

import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import router from './routes/auth'
import session from 'express-session';
import passport from './config/passport';
import authRoutes from './routes/auth';
import diaryEntryRoutes from './routes/diaryEntry';
import rateLimit from 'express-rate-limit';
import notFoundRoutes from './middlewares/notFound';
import cors from 'cors';

const app = express();
const PORT = 5000;
const secret = String(process.env.SECRET_KEY);

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(express.json());

app.use(cors({
  origin: (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, ''), 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  credentials: true // Allow cookies and credentials
}));

app.options('*', cors());

app.use('/uploads', express.static('uploads')); 

app.use(session({
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3 * 24 * 60 * 60 * 1000 } 
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/entries', diaryEntryRoutes);

// 404 routes
app.use(notFoundRoutes); 

app.use('/api/auth/user', authLimiter, authRoutes); 

app.get('/', (req: Request, res: Response) => {
  res.send('The Web-Diary');
});

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGODB_URI environment variable is not defined.');
}

mongoose.connect(mongoUri)
.then(() => {
  console.log('Connected to Database !')
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API running at http://localhost:${PORT}/`);
  });
})
.catch(err => console.error(err));
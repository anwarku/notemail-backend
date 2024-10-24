import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Call the connect function
try {
    const uriCloud = "mongodb+srv://khaerilanwar1992:MK3XtZHNM0SBFkPv@notemail.iq4hp4d.mongodb.net/notemail?retryWrites=true&w=majority&appName=notemail"
    await mongoose.connect(uriCloud)
    console.log('Connected to the database');
} catch (error) {
    console.log(error);
}

app.use(cors({ origin: "https://notemail.vercel.app", credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser())
app.use(router);

app.listen(port, () => console.log(`Server is running on port ${port}`));

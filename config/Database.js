import mongoose from "mongoose";

const uri = "mongodb://127.0.0.1:27017/notemail";
const uriCloud = "mongodb+srv://khaerilanwar1992:MK3XtZHNM0SBFkPv@notemail.iq4hp4d.mongodb.net/notemail?retryWrites=true&w=majority&appName=notemail"
await mongoose.connect(uriCloud)
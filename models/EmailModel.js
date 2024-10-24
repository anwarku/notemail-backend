import mongoose from "mongoose";
import { Schema } from "mongoose";

const emailSchema = new Schema({
    owner: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, { versionKey: false });

const EmailModel = mongoose.model('Email', emailSchema);

export default EmailModel;
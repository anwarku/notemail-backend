import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String }
}, { versionKey: false });

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
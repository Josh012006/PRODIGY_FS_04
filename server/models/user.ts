import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    username: String,
    phone: String,
    profilePicture: String,
    bgImage: String,
    story: String,
    status: {
        type: String,
        default: "Hey there! I am using Echo."
    },
    present : Boolean,
    statusPrivacy: {
        type: String,
        default: "public"
    },
    contacts: Array,
    conversations: Array,
    groups: Array,
}, { timestamps: true });


const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
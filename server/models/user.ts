import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    username: String,
    phone: String,
    profilePicture: {
        type: String,
        default: "unknown.jpg"
    },
    bgImage: {
        type: String,
        default: "bg.jpg"
    },
    story: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "Hey there! I am using Echo."
    },
    present : {
        type: Boolean,
        default: false
    },
    statusPrivacy: {
        type: String,
        default: "public"
    },
    contacts: {
        type: Array,
        default: []
    },
    conversations: {
        type: Array,
        default: []
    },
    groups: {
        type: Array,
        default: []
    },
}, { timestamps: true });


const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
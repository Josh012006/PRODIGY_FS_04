import mongoose from "mongoose";



const group = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    members: Array,
    groupPicture: String,
    messages: Array,
    medias: Array,
}, { timestamps: true });
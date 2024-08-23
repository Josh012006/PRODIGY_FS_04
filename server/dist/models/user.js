"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
    present: {
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
const userModel = mongoose_1.default.models.User || mongoose_1.default.model("User", userSchema);
exports.default = userModel;

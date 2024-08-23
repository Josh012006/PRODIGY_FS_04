"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const groupSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: String,
    members: Array,
    groupPicture: {
        type: String,
        default: ""
    },
    messages: {
        type: Array,
        default: []
    },
}, { timestamps: true });
const groupModel = mongoose_1.default.models.Group || mongoose_1.default.model("Group", groupSchema);
exports.default = groupModel;

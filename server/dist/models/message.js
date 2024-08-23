"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
function validateContent(value) {
    if (typeof value === 'string') {
        return true; // C'est une chaîne de caractères
    }
    if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
        return true; // C'est un tableau de chaînes de caractères
    }
    return false; // C'est ni une chaîne ni un tableau de chaînes
}
const messageSchema = new mongoose_1.default.Schema({
    sender: String,
    receiver: {
        type: mongoose_1.SchemaTypes.Mixed,
        validate: {
            validator: validateContent,
            message: (props) => `${props.value} is not a valid content type! Must be a string or an array of strings.`
        },
    },
    type: String,
    content: String,
}, { timestamps: true });
const messageModel = mongoose_1.default.models.Message || mongoose_1.default.model("Message", messageSchema);
exports.default = messageModel;

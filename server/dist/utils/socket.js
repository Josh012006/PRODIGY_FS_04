"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const conversation_1 = __importDefault(require("../models/conversation"));
const message_1 = __importDefault(require("../models/message"));
const db_1 = __importDefault(require("../config/db"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const UPLOAD_DIR = path_1.default.resolve("public/messages/medias");
const initSocket = (server) => {
    const io = new socket_io_1.Server(server);
    io.on("connection", (socket) => {
        console.log("User connected");
        socket.on("sendMessage", (_a) => __awaiter(void 0, [_a], void 0, function* ({ sender, receiver, type, content, conversationId, formData }) {
            yield (0, db_1.default)();
            try {
                let myContent = content;
                if (type === "video" || type === "image") {
                    const body = Object.fromEntries(formData);
                    const file = body.file || null;
                    console.log(file);
                    if (file) {
                        const buffer = Buffer.from(yield file.arrayBuffer());
                        if (!fs_1.default.existsSync(UPLOAD_DIR)) {
                            fs_1.default.mkdirSync(UPLOAD_DIR);
                        }
                        const uniqueFileName = `${(0, uuid_1.v4)()}-${body.file.name}`;
                        fs_1.default.writeFileSync(path_1.default.resolve(UPLOAD_DIR, uniqueFileName), buffer);
                        myContent = uniqueFileName;
                    }
                    else {
                        throw Error("File needed");
                    }
                }
                const newMessage = new message_1.default({ sender, receiver, type, content: myContent });
                yield newMessage.save();
                const conversation = yield conversation_1.default.findById(conversationId);
                if (conversation) {
                    conversation.messages.push(newMessage._id);
                    yield conversation.save();
                }
                io.to(sender).emit("receiveMessage", newMessage);
                io.to(receiver).emit("receiveMessage", newMessage);
            }
            catch (error) {
                console.log("Error sending message:", error);
            }
        }));
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};
exports.initSocket = initSocket;

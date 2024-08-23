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
const express = require("express");
const http = require("http");
require("dotenv").config();
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const conversation_1 = __importDefault(require("./models/conversation"));
const message_1 = __importDefault(require("./models/message"));
const db_1 = __importDefault(require("./config/db"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const group_1 = __importDefault(require("./models/group"));
const UPLOAD_DIR = path_1.default.resolve("../public/messages/medias");
const server = (0, http_1.createServer)();
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    },
    pingInterval: 10000, // intervalle entre chaque ping (en ms)
    pingTimeout: 5000,
    maxHttpBufferSize: 50 * 1024 * 1024, // délai avant de considérer une connexion comme perdue (en ms)
});
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    // Lorsque l'utilisateur rejoint une conversation ou un groupe, ajoutez-le à un salon
    socket.on("joinConversation", (conversationId) => {
        socket.join(conversationId);
        console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });
    socket.on("joinGroup", (groupId) => {
        socket.join(groupId);
        console.log(`Socket ${socket.id} joined group ${groupId}`);
    });
    socket.on("sendMessage", (_a) => __awaiter(void 0, [_a], void 0, function* ({ sender, receiver, type, content, conversationId, groupId, formData, name }) {
        console.log("Message sent!");
        try {
            console.log("type", type);
            yield (0, db_1.default)();
            let myContent = content;
            if (conversationId) {
                if (type === "video" || type === "image") {
                    const file = formData || null;
                    if (file) {
                        if (!fs_1.default.existsSync(UPLOAD_DIR)) {
                            fs_1.default.mkdirSync(UPLOAD_DIR);
                        }
                        const uniqueFileName = `${(0, uuid_1.v4)()}-${name}`;
                        fs_1.default.writeFileSync(path_1.default.resolve(UPLOAD_DIR, uniqueFileName), file);
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
                // Emit the message to the specific conversation room
                io.to(conversationId).emit("receiveMessage", newMessage);
            }
            else if (groupId) {
                if (type === "video" || type === "image") {
                    const file = formData || null;
                    if (file) {
                        if (!fs_1.default.existsSync(UPLOAD_DIR)) {
                            fs_1.default.mkdirSync(UPLOAD_DIR);
                        }
                        const uniqueFileName = `${(0, uuid_1.v4)()}-${name}`;
                        fs_1.default.writeFileSync(path_1.default.resolve(UPLOAD_DIR, uniqueFileName), file);
                        myContent = uniqueFileName;
                    }
                    else {
                        throw Error("File needed");
                    }
                }
                const newMessage = new message_1.default({ sender, receiver, type, content: myContent });
                yield newMessage.save();
                const group = yield group_1.default.findById(groupId);
                if (group) {
                    group.messages.push(newMessage._id);
                    yield group.save();
                }
                // Emit the message to the specific group room
                io.to(groupId).emit("receiveMessage", newMessage);
            }
        }
        catch (error) {
            console.log("Error sending message:", error);
        }
    }));
    socket.conn.on("transportError", (error) => {
        console.error(`Transport error for ${socket.id}: ${error.message}`);
    });
    socket.on("disconnect", (reason) => {
        console.log("User disconnected ", reason);
    });
    socket.on("connect_error", (error) => {
        console.error(`Connection error: ${error.message}`);
    });
});
server.listen(5050, () => {
    console.log("Server started on port", 5050);
});

const express = require("express");
const http = require("http");

require("dotenv").config();

import { createServer } from "http";
import { Server } from "socket.io";

import conversationModel from "./models/conversation";
import messageModel from "./models/message";
import connectDB from "./config/db";

import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import groupModel from "./models/group";

const UPLOAD_DIR = path.resolve("../public/messages/medias");


const server = createServer();

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    },
    pingInterval: 10000, // intervalle entre chaque ping (en ms)
    pingTimeout: 5000,
    maxHttpBufferSize: 50 * 1024 * 1024,   // délai avant de considérer une connexion comme perdue (en ms)
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

    socket.on("sendMessage", async ({ sender, receiver, type, content, conversationId, groupId, formData, name }) => {
        console.log("Message sent!");

        try {
            console.log("type", type);

            await connectDB();

            let myContent = content;

            if (conversationId) {
                if (type === "video" || type === "image") {
                    const file = (formData as Buffer) || null;

                    if (file) {
                        if (!fs.existsSync(UPLOAD_DIR)) {
                            fs.mkdirSync(UPLOAD_DIR);
                        }

                        const uniqueFileName = `${uuidv4()}-${name}`;
                        fs.writeFileSync(
                            path.resolve(UPLOAD_DIR, uniqueFileName),
                            file
                        );

                        myContent = uniqueFileName;
                    } else {
                        throw Error("File needed");
                    }
                }

                const newMessage = new messageModel({ sender, receiver, type, content: myContent });
                await newMessage.save();

                const conversation = await conversationModel.findById(conversationId);
                if (conversation) {
                    conversation.messages.push(newMessage._id);
                    await conversation.save();
                }

                // Emit the message to the specific conversation room
                io.to(conversationId).emit("receiveMessage", newMessage);
            } else if (groupId) {
                if (type === "video" || type === "image") {
                    const file = (formData as Buffer) || null;

                    if (file) {
                        if (!fs.existsSync(UPLOAD_DIR)) {
                            fs.mkdirSync(UPLOAD_DIR);
                        }

                        const uniqueFileName = `${uuidv4()}-${name}`;
                        fs.writeFileSync(
                            path.resolve(UPLOAD_DIR, uniqueFileName),
                            file
                        );

                        myContent = uniqueFileName;
                    } else {
                        throw Error("File needed");
                    }
                }

                const newMessage = new messageModel({ sender, receiver, type, content: myContent });
                await newMessage.save();

                const group = await groupModel.findById(groupId);
                if (group) {
                    group.messages.push(newMessage._id);
                    await group.save();
                }

                // Emit the message to the specific group room
                io.to(groupId).emit("receiveMessage", newMessage);
            }

        } catch (error) {
            console.log("Error sending message:", error);
        }
    });

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
})
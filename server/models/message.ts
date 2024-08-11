import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    type: String,
    content: String,
}, { timestamps: true });



const messageModel = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default messageModel;
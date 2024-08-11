import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    members: Array,
    messages: Array,
    medias: Array,
}, { timestamps: true });



const conversationModel = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);

export default conversationModel;

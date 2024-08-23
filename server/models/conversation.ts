import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    members: Array,
    names: Array,
    profilePictures: Array,
    stories: Array,
    messages: {
        type: Array,
        default: []
    },
}, { timestamps: true });



const conversationModel = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);

export default conversationModel;

import mongoose from "mongoose";



const groupSchema = new mongoose.Schema({
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




const groupModel = mongoose.models.Group || mongoose.model("Group", groupSchema);


export default groupModel;

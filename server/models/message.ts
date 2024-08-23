import mongoose, { SchemaTypes } from "mongoose";

function validateContent(value: any) {
    if (typeof value === 'string') {
        return true;  // C'est une chaîne de caractères
    }
    if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
        return true;  // C'est un tableau de chaînes de caractères
    }
    return false;  // C'est ni une chaîne ni un tableau de chaînes
}


const messageSchema = new mongoose.Schema({
    sender: String,
    receiver: {
        type: SchemaTypes.Mixed,
        validate: {
            validator: validateContent,
            message: (props: any) => `${props.value} is not a valid content type! Must be a string or an array of strings.`
        },
    },
    type: String,
    content: String,
}, { timestamps: true });



const messageModel = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default messageModel;
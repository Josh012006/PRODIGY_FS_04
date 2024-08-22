
import connectDB from "@/server/config/db";
import conversationModel from "@/server/models/conversation";
import userModel from "@/server/models/user";
import { NextRequest, NextResponse } from "next/server";





export async function POST(req: NextRequest) {
    try {
        
        await connectDB();

        const { userId, contactId, userName, contactName, userProfile, contactProfile, userStory, contactStory } = await req.json();

        const newConversation = new conversationModel({
            members: [userId, contactId],
            names: [userName, contactName],
            profilePictures: [userProfile, contactProfile],
            stories: [userStory, contactStory]
        });

        const conversation = await newConversation.save();

        if(!conversation) {
            throw Error("An error while creating conversation!");
        }
        else {
            const newUsers = await userModel.updateMany({ _id: { $in : [userId, contactId]}}, { $push: {conversations: conversation._id } }, {new: true});

            if(!newUsers) {
                throw Error("An error while adding conversations to users' objects!");
            }
            else {
                console.log("Conversation successfully added!");
                return NextResponse.json({message: "Conversation successfully added!"}, {status: 200})
            }
        }

    } catch (error) {
        console.log("An error occurred in add conversation route ", error);
        return NextResponse.json({message: "An error occurred in add conversation route"}, {status: 500})
    }
}
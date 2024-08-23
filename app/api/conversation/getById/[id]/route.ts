import connectDB from "@/server/config/db";
import conversationModel from "@/server/models/conversation";
import { NextRequest, NextResponse } from "next/server";





export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
    try {
        
        await connectDB();

        const conversation = await conversationModel.findById(params.id);

        if(!conversation) {
            throw Error("Conversation not found!");
        }
        else {
            return NextResponse.json(conversation, {status: 200});
        }


    } catch (error) {
        console.log("An error occurred in get conversation by id route ", error);
        return NextResponse.json({message: "An unexpected error occurred! Please reload the page!"}, {status: 500});
    }
}
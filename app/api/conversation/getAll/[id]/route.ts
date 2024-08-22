import connectDB from "@/server/config/db";
import conversationModel from "@/server/models/conversation";
import { NextRequest, NextResponse } from "next/server";






export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
    try {
        
        await connectDB();

        const conversations = await conversationModel.find({ members: { $in: [params.id] }});

        return NextResponse.json(conversations, {status: 200});

    } catch (error) {
        console.log("An error occurred in get all conversations route " ,error);
        return NextResponse.json({message: "An error occurred in get all conversations route!"}, {status: 500});
    }
}
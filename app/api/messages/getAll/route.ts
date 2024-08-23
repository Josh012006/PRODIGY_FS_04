import connectDB from "@/server/config/db";
import messageModel from "@/server/models/message";
import { NextRequest, NextResponse } from "next/server";






export async function POST(req:NextRequest) {
    try {
        
        const {tab} = await req.json();

        await connectDB();

        const messages = await messageModel.find({_id: {$in: tab}});

        return NextResponse.json(messages, {status: 200});

    } catch (error) {
        console.log("An error occurred in get all messages route ", error);
        return NextResponse.json({message: "An error occurred in get all messages route!"}, {status: 500})
    }
}
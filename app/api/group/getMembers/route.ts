import connectDB from "@/server/config/db";
import userModel from "@/server/models/user";
import { NextRequest, NextResponse } from "next/server";







export async function POST(req: NextRequest) {
    try {
        
        await connectDB();

        const {tab} = await req.json();

        const users = await userModel.find({ _id: { $in : tab}});


        return NextResponse.json(users, {status : 200});


    } catch (error) {
        console.log("An error occurred in get all group members route ", error);
        return NextResponse.json({message: "An error occurred in get all group members route! Please try again!"}, {status: 500});
    }
}
import connectDB from "@/server/config/db";
import userModel from "@/server/models/user";
import { NextRequest, NextResponse } from "next/server";






export async function POST(req: NextRequest) {
    try {
        
        await connectDB();

        const {email} = await req.json();

        const user = await userModel.findOne({ email });

        if(! user) {
            console.log("No user found!");
            return NextResponse.json({message: "No such user!"}, {status: 404});
        }

        return NextResponse.json(user, {status: 200});

    } catch (error) {
        console.log("An error occurred in findOne user route ", error);
        return NextResponse.json({message: "An error occurred in findOne user route!"}, {status: 500});
    }
}
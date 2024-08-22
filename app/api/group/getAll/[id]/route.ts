import connectDB from "@/server/config/db";
import groupModel from "@/server/models/group";
import { NextRequest, NextResponse } from "next/server";




export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
    try {
        
        await connectDB();

        const groups = await groupModel.find({ members: { $in: [params.id] }});

        return NextResponse.json(groups, {status: 200});

    } catch (error) {
        console.log("An error occurred in get all groups route: ", error);
        return NextResponse.json({message: "An error in get all groups route!"}, {status: 500});
    }
}
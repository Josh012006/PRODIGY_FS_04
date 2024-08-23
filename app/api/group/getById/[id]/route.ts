import connectDB from "@/server/config/db";
import groupModel from "@/server/models/group";
import { NextRequest, NextResponse } from "next/server";





export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
    try {
        
        await connectDB();

        const group = await groupModel.findById(params.id);

        if(!group) {
            throw Error("Group not found!");
        }
        else {
            return NextResponse.json(group, {status: 200});
        }


    } catch (error) {
        console.log("An error occurred in get group by id route ", error);
        return NextResponse.json({message: "An unexpected error occurred! Please reload the page!"}, {status: 500});
    }
}
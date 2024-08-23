import connectDB from "@/server/config/db";
import groupModel from "@/server/models/group";
import userModel from "@/server/models/user";
import { NextRequest, NextResponse } from "next/server";






export async function POST(req: NextRequest) {
    try {
        
        const {tab, groupId} = await req.json();

        await connectDB();

        const group = await groupModel.findById(groupId);

        group.members = [...group.members, ...tab];

        await group.save();

        const users = await userModel.updateMany({_id: {$in: tab}}, {groups: {$push: groupId}}, {new: true});

        return NextResponse.json({message: "Group members successfully added!"}, {status: 200});
        
    } catch (error) {
        console.log("An error occurred in add members to group route ", error);
        return NextResponse.json({message: "An error occurred in add members to group route!"}, {status: 500});
    }
}
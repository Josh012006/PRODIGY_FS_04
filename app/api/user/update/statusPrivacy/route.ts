import connectDB from "@/server/config/db";
import userModel from "@/server/models/user";
import { NextRequest, NextResponse } from "next/server";





export async function PATCH(req: NextRequest) {
    try {
        
        await connectDB();

        const { _id, statusPrivacy } = await req.json();

        const user = await userModel.findById(_id);

        if(!user) {
            throw Error("User not found");
        }
        else {
            const update = await userModel.findByIdAndUpdate(_id, {statusPrivacy}, {new: true});

            if(!update) {
                throw Error("Update didn't work!")
            }
        }

        return NextResponse.json({message: "Update done successfully!"}, {status: 200});


    } catch (error) {
        console.log("An error occurred in update status privacy route ", error);
        return NextResponse.json({message: "An error occurred in update status privacy route"}, {status: 500})
        
    }
}
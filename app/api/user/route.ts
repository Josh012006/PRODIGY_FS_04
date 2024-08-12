import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import userModel from "@/server/models/user";
import connectDB from "@/server/config/db";


export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("echoToken")?.value;

        await connectDB();

        if(!token) {
            throw new Error("No token.")
        }

        const tokenResult: any = jwt.verify(token, process.env.JWT_SECRET as string);

        const user = await userModel.findById(tokenResult._doc._id);

        return NextResponse.json(user, {status: 200});

    } catch (error) {
        console.log("An unexpected error occurred in fetchUser route ", error);
        return NextResponse.json({message: "An unexpected error occurred in fetchUser route"}, {status: 500})
    }
}
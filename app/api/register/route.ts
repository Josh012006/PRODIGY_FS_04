import connectDB from "@/server/config/db";
import userModel from "@/server/models/user";
import { hashPassword } from "@/server/utils/hashPassword";
import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";




export async function POST(req: NextRequest) {
    try {
        
        const { email, password, name, username, phone } = await req.json();

        await connectDB();

        const verify = await userModel.findOne({email});

        if(verify) {
            console.log('This user already exists');
            return NextResponse.json({message: "This user already exists"}, {status: 401});
        }

        const user = new userModel({
            email,
            password: await hashPassword(password),
            name,
            username,
            phone
        });

        const newUser = await user.save();

        const response = NextResponse.json(newUser, {status: 201});

        const token = jwt.sign({ ...user }, process.env.JWT_SECRET as string);
        response.cookies.set('echoToken', token, { httpOnly: true, sameSite: "strict", maxAge: 1000*60*60*24*10 });

        return response;

        console.log("User successfully registered ", newUser);

    } catch (error) {
        console.log("An error occured in registration route ", error);
        return NextResponse.json({message: "An error occured in registration route" }, {status: 500})
    }
}
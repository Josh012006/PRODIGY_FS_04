import User from "@/interfaces/user";
import connectDB from "@/server/config/db";
import userModel from "@/server/models/user";
import { verifyPassword } from "@/server/utils/hashPassword";
import { NextRequest, NextResponse } from "next/server";

import jwt from 'jsonwebtoken';




export async function POST(req: NextRequest) {
    try {
        
        const { email, password } = await req.json();

        await connectDB();

        const user: User | null = await userModel.findOne({ email });

        if(! user) {
            console.log("Invalid email");
            return NextResponse.json({message: "Invalid email"}, {status: 404});
        }
        else {
            const same : boolean = await verifyPassword(password, user.password);

            if(!same) {
                console.log("Invalid password");
                return NextResponse.json({message: "Invalid password"}, {status: 404});
            }
            else {
                const response = NextResponse.json(user, {status: 200});

                const token = jwt.sign({ ...user }, process.env.JWT_SECRET as string);
                response.cookies.set('echoToken', token, { httpOnly: true, sameSite: "strict", maxAge: 1000*60*60*24*10 });

                console.log('Successfully logged in!', user);

                return response;
            }
        }

    } catch (error) {
        console.log("An error occurred in login route ", error);
        return NextResponse.json({ message: "An error occured in login route " + error}, {status: 500})
    }
}
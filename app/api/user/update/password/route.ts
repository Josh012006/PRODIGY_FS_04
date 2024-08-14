import connectDB from "@/server/config/db";
import userModel from "@/server/models/user";
import { hashPassword, verifyPassword } from "@/server/utils/hashPassword";
import { NextRequest, NextResponse } from "next/server";




export async function PATCH(req: NextRequest) {
    try {
        
        const { _id, password, newPassword } = await req.json();

        await connectDB();

        const user = await userModel.findById(_id);

        if(!user) {
            throw Error("User not found");
        }
        else {
            const verification = await verifyPassword(password, user.password);

            if(!verification) {
                console.log("Password invalid!");
                return NextResponse.json({message: "Password invalid"}, {status: 401})
            }
            else {
                const update = await userModel.findByIdAndUpdate(_id, {password: await hashPassword(newPassword)}, {new: true});

                if(!update) {
                    throw Error("Update didn't work!")
                }

                else {
                    return NextResponse.json({message: "Update done successfully!"}, {status: 200});
                }
            }
        }

    } catch (error) {
        console.log("An error occurred in update password route ", error);
        return NextResponse.json({message: "An error occurred in update route"}, {status: 500})
    }
}
import { NextRequest, NextResponse } from "next/server";

import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/server/config/db";
import groupModel from "@/server/models/group";
import userModel from "@/server/models/user";

const UPLOAD_DIR = path.resolve("public/users/profile_pictures");




export async function POST(req: NextRequest) {
    try {

        await connectDB();

        const formData = await req.formData();

        const name = formData.get("group-name") as string;
        const description = formData.get("group-description") as string;

        const body = Object.fromEntries(formData);

        const members = JSON.parse(body.members as string);

        const file = (body.media as Blob) || null;

        console.log(file);

        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            if (!fs.existsSync(UPLOAD_DIR)) {
                fs.mkdirSync(UPLOAD_DIR);
            }
        
            const uniqueFileName = `${uuidv4()}-${(body.media as File).name}`;
            fs.writeFileSync(
                path.resolve(UPLOAD_DIR, uniqueFileName),
                buffer
            );

            console.log(uniqueFileName);


            const group = await groupModel.create({name, description, members, groupPicture: uniqueFileName});


            if(group) {
                console.log(group);

                const users = await userModel.updateMany({_id: {$in: members}}, {$push: {groups: group._id}}, {new: true});

                if(users) {
                    return NextResponse.json({
                        message: "Group successfully created"
                    }, {status: 200});
                }
                else {
                    throw Error("An error occurred while trying to add the group to the users");
                }
            }
            else {
                throw Error("An error occurred while trying to create the group");
            }

        } else {
            throw Error("File needed");
        }


    } catch (error) {
        console.log("An error occurred in add group route ", error);
        return NextResponse.json({ message: "An error occurred in add group route!"}, { status: 500 });
    }
}
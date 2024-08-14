import connectDB from "@/server/config/db";
import { NextRequest, NextResponse } from "next/server";

import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import userModel from "@/server/models/user";

const UPLOAD_DIR = path.resolve("public/users/bg_images");

export async function PATCH(req: NextRequest) {
    try {


        await connectDB();

        const formData = await req.formData();
        const body = Object.fromEntries(formData);

        const bg = (body.bg as Blob) || null;

        console.log(bg);

        if (bg) {
            const buffer = Buffer.from(await bg.arrayBuffer());
            if (!fs.existsSync(UPLOAD_DIR)) {
                fs.mkdirSync(UPLOAD_DIR);
            }
        
            const uniqueFileName = `${uuidv4()}-${(body.bg as File).name}`;
            fs.writeFileSync(
                path.resolve(UPLOAD_DIR, uniqueFileName),
                buffer
            );

            console.log(uniqueFileName);


            // update the profile picture name

            const user = await userModel.findByIdAndUpdate(body._id, { bgImage: uniqueFileName }, { new: true });

            if(user) {
                console.log(user);

                if(body.oldBg !== "bg.jpg") {
                    const pathToFile = path.resolve(UPLOAD_DIR, body.oldBg as string);

                    fs.unlink(pathToFile, (err) => {
                        if (err) {
                            console.error('Error deleting the file:', err);
                            throw Error("An error occurred while deleting user's bg image");
                        }
                        console.log('File deleted successfully');
                    });
                }

                return NextResponse.json({
                    message: "Bg image successfully updated"
                }, {status: 200});
            }
            else {
                throw Error("An error occurred while trying to update the bg image name");
            }

        } else {
            throw Error("File needed");
        }

        
    } catch (error) {
        console.log("An error occurred in update bg image route ", error);
        return NextResponse.json({message: "An error occured in update bg image route."}, {status: 500})
    }
}

import connectDB from "@/server/config/db";
import { NextRequest, NextResponse } from "next/server";

import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import userModel from "@/server/models/user";
import conversationModel from "@/server/models/conversation";

const UPLOAD_DIR = path.resolve("public/users/profile_pictures");

export async function PATCH(req: NextRequest) {
    try {

        await connectDB();

        const formData = await req.formData();
        const body = Object.fromEntries(formData);

        const file = (body.file as Blob) || null;

        console.log(file);

        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            if (!fs.existsSync(UPLOAD_DIR)) {
                fs.mkdirSync(UPLOAD_DIR);
            }
        
            const uniqueFileName = `${uuidv4()}-${(body.file as File).name}`;
            fs.writeFileSync(
                path.resolve(UPLOAD_DIR, uniqueFileName),
                buffer
            );

            console.log(uniqueFileName);


            // update the profile picture name

            const user = await userModel.findByIdAndUpdate(body._id, { profilePicture: uniqueFileName }, { new: true });

            const conversations = await conversationModel.find({ 
                members: { $in: [body._id] } 
            });
            
            for (const conversation of conversations) {
                const fileIndex = conversation.profilePictures.indexOf(body.oldFile);
                
                // Si le fichier est trouvé, retirer une seule occurrence
                if (fileIndex !== -1) {
                    conversation.profilePictures.splice(fileIndex, 1); // Retire une seule occurrence
                }
                
                // Ajouter le nouvel élément (ici `uniqueFileName`)
                conversation.profilePictures.push(uniqueFileName); 
                
                // Sauvegarder le document mis à jour
                await conversation.save();
            }
            

            if(user) {
                console.log(user);

                const pathToFile = path.resolve(UPLOAD_DIR, body.oldFile as string);

                fs.unlink(pathToFile, (err) => {
                    if (err) {
                        console.error('Error deleting the file:', err);
                        throw Error("An error occurred while deleting user's profile picture");
                    }
                    console.log('File deleted successfully');
                });

                return NextResponse.json({
                    message: "Profile picture successfully updated"
                }, {status: 200});
            }
            else {
                throw Error("An error occurred while trying to update the profile picture name");
            }

        } else {
            throw Error("File needed");
        }

        
    } catch (error) {
        console.log("An error occurred in update profile picture route ", error);
        return NextResponse.json({message: "An error occured in update profile route."}, {status: 500})
    }
}

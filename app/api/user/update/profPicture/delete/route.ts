import connectDB from "@/server/config/db";
import userModel from "@/server/models/user";
import { NextRequest, NextResponse } from "next/server";


import path from "path";
import fs from "fs";
import conversationModel from "@/server/models/conversation";


const UPLOAD_DIR = path.resolve("public/users/profile_pictures");


export async function PATCH(req: NextRequest) {
    try {
        
        await connectDB();

        const { _id, oldFile } = await req.json();

        const user = await userModel.findById(_id);

        if(!user) {
            throw Error("User not found");
        }
        else {
            const update = await userModel.findByIdAndUpdate(_id, {profilePicture: ""}, {new: true});

            if(!update) {
                throw Error("Update didn't work!")
            } 

            const conversations = await conversationModel.find({ 
                members: { $in: [_id] } 
            });
            
            for (const conversation of conversations) {
                const fileIndex = conversation.profilePictures.indexOf(oldFile);
                
                // Si le fichier est trouvé, retirer seulement une occurrence
                if (fileIndex !== -1) {
                    conversation.profilePictures.splice(fileIndex, 1); // Retire une seule occurrence
                }
                
                // Ajouter un nouvel élément (ici une chaîne vide `""`)
                conversation.profilePictures.push(""); 
                
                // Sauvegarder le document mis à jour
                await conversation.save();
            }
            

            if(oldFile !== "") {
                const pathToFile = path.resolve(UPLOAD_DIR, oldFile as string);

                fs.unlink(pathToFile, (err) => {
                    if (err) {
                        console.error('Error deleting the file:', err);
                        throw Error("An error occurred while deleting user's profile picture");
                    }
                    console.log('File deleted successfully');
                });
            }
        }

        return NextResponse.json({message: "Update done successfully!"}, {status: 200});


    } catch (error) {
        console.log("An error occurred in delete profile picture route ", error);
        return NextResponse.json({message: "An error occurred in delete profile picture route"}, {status: 500})
        
    }
}



import connectDB from "@/server/config/db";
import userModel from "@/server/models/user";
import { NextRequest, NextResponse } from "next/server";

import fs from "fs";
import path from "path";

import { v4 as uuidv4 } from "uuid";
import conversationModel from "@/server/models/conversation";


const UPLOAD_DIR = path.resolve("public/users/stories");


export async function PATCH(req: NextRequest) {
    try {
        
        await connectDB();

        const formData = await req.formData();
        const body = Object.fromEntries(formData);

        const story = (body.story as Blob) || null;

        console.log(story);

        if (story) {
            const buffer = Buffer.from(await story.arrayBuffer());
            if (!fs.existsSync(UPLOAD_DIR)) {
                fs.mkdirSync(UPLOAD_DIR);
            }
        
            const uniqueFileName = `${uuidv4()}-${(body.story as File).name}`;
            fs.writeFileSync(
                path.resolve(UPLOAD_DIR, uniqueFileName),
                buffer
            );


            // update the profile picture name

            const user = await userModel.findByIdAndUpdate(body._id, { story: uniqueFileName }, { new: true });

            const conversations = await conversationModel.find({ 
                members: { $in: [body._id] } 
            });
            
            for (const conversation of conversations) {
                const storyIndex = conversation.stories.indexOf(body.oldStory);
                
                // Si l'histoire est trouvée, la retirer
                if (storyIndex !== -1) {
                    conversation.stories.splice(storyIndex, 1); // Retire seulement une occurrence
                }
                
                // Ajouter un nouvel élément (ici `uniqueFileName`)
                conversation.stories.push(uniqueFileName); 
                
                // Sauvegarder le document mis à jour
                await conversation.save();
            }
            

            if(user) {
                console.log(user);

                if(body.oldStory) {
                    const pathToFile = path.resolve(UPLOAD_DIR, body.oldStory as string);

                    fs.unlink(pathToFile, (err) => {
                        if (err) {
                            console.error('Error deleting the file:', err);
                            throw Error("An error occurred while deleting user's story");
                        }
                        console.log('File deleted successfully');
                    });
                }

                return NextResponse.json({
                    message: "Story successfully updated"
                }, {status: 200});
            }
            else {
                throw Error("An error occurred while trying to update the story");
            }

        } else {
            const user = await userModel.findByIdAndUpdate(body._id, { story: "" }, { new: true });

            const conversations = await conversationModel.find({ 
                members: { $in: [body._id] } 
            });
            
            for (const conversation of conversations) {
                const storyIndex = conversation.stories.indexOf(body.oldStory);
                
                // Si l'histoire est trouvée, la retirer
                if (storyIndex !== -1) {
                    conversation.stories.splice(storyIndex, 1); // Retire seulement une occurrence
                }
                
                // Ajouter un nouvel élément (ici une chaîne vide `""`)
                conversation.stories.push(""); 
                
                // Sauvegarder le document mis à jour
                await conversation.save();
            }
            

            if(user) {
                console.log(user);

                if(body.oldStory) {
                    const pathToFile = path.resolve(UPLOAD_DIR, body.oldStory as string);

                    fs.unlink(pathToFile, (err) => {
                        if (err) {
                            console.error('Error deleting the file:', err);
                            throw Error("An error occurred while deleting user's story");
                        }
                        console.log('File deleted successfully');
                    });
                }

                return NextResponse.json({
                    message: "Story successfully updated"
                }, {status: 200});
            }
            else {
                throw Error("An error occurred while trying to update the story");
            }
        }

    } catch (error) {
        console.log("An error occurred in update story route ", error);
        return NextResponse.json({message: "An error occurred in update story route"}, {status: 500})
        
    }
}
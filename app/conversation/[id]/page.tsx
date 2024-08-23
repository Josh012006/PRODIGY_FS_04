"use client"

import ErrorAlert from "@/components/ErrorAlert";
import Loader from "@/components/Loader";
import Conversation from "@/interfaces/conversation";
import Message from "@/interfaces/message";
import User from "@/interfaces/user";
import fetchUserInfos from "@/server/utils/fetchUserInfos";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import io, { Socket } from "socket.io-client";




import { FilePond, registerPlugin } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)





function ConversationPage() {


    const id = useParams().id;

    const [user, setUser] = useState<User | null>(null);

    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [conversationLoading, setConversationLoading] = useState(true);
    const [conversationError, setConversationError] = useState("");

    const [chat, setChat] = useState<Message[]>([]);
    const [messageLoading, setMessageLoading] = useState(true);
    const [messageError, setMessageError] = useState("");
    const [socket, setSocket] = useState<typeof Socket | null>(null);

    const [newMessage, setNewMessage] = useState("");
    const [message, setMessage] = useState<Message | null>(null);


    const [displaySendMedia, setDisplaySendMedia] = useState(false);
    const [media, setMedia] = useState<any>([]);
    const [type, setType] = useState("image");

    useEffect(() => {
        async function fetchUser() {
            const user = await fetchUserInfos();

            setUser(user);
        }

        fetchUser();

    }, []);

    useEffect(() => {
        async function fetchConversationInfos() {
            try {
                
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/conversation/getById/${id}`);

                if(response.status === 200) {
                    setConversation(response.data as Conversation);
                    setConversationLoading(false);
                }
                else {
                    throw Error("An error occurred in get conversation by id route ", response.data);
                }

            } catch (error) {
                console.log("An error occurred while fetching the conversation infos: ", error);
                setConversationLoading(false);
                setConversationError("An unexpected error occurred! Please reload the page!");
            }
        }

        fetchConversationInfos();

    }, [id]);

    useEffect(() => {
        async function fetchMessages() {
            try {
                
                if(conversation) {
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/messages/getAll`, JSON.stringify({tab: conversation.messages}), {headers: { "Content-Type": "application/json"}, validateStatus: status => status >= 200});

                    if(response.status === 200) {
                        setChat(response.data as Message[])
                        setMessageLoading(false);
                    }
                    else {
                        throw Error("An error occurred in get all messages route ", response.data);
                    }
                }


            } catch (error) {
                console.log("An error occurred while fetching the messages: ", error);
                setMessageLoading(false);
                setMessageError("An unexpected error occurred! Please reload the page!");
            }
        }

        fetchMessages();

    }, [conversation]);

    useEffect(() => {
        const socketIo = io("http://localhost:5050");
        setSocket(socketIo);

        // Rejoindre le salon du groupe
        if (conversation && socketIo) {
            socketIo.emit("joinConversation", conversation._id);
        }

        // Écouter les messages reçus
        socketIo.on("receiveMessage", (newMessage: Message) => {
            setChat((prevChat) => [...prevChat, newMessage]);
        });

        socketIo.on("disconnect", (reason: any) => {
            console.log("User disconnected ", reason);
        });

        socketIo.on("connect_error", (error: any) => {
            console.log("Connection error:", error);
        });

        return () => {
            socketIo.disconnect();
        };
    }, [conversation]);

    useEffect(() => {
        const element = document.querySelector('#main');
        if (element) {
            element.scrollTop = element.scrollHeight; // Scroller jusqu'en bas
        }
    }, [chat]);

    const sendMessage = async (formData?: any) => {
        if (socket) {
            if(formData) {

                const messageData: {
                    sender: string;
                    receiver: string;
                    type: string;
                    content: string;
                    conversationId: string;
                    formData: any;
                    name:string,
                } = {
                    sender: user?._id as string,
                    receiver: conversation?.members.filter((member) => member !== user?._id)[0] as string,
                    type,
                    content: "",
                    conversationId: conversation?._id as string,
                    formData: formData,
                    name: media[0].name
                };

                console.log(messageData);

                // Envoyer un message au serveur
                await socket.emit("sendMessage", messageData);
            }
            else {
                const messageData: {
                    sender: string;
                    receiver: string;
                    type: string;
                    content: string;
                    conversationId: string;
                } = {
                    sender: user?._id as string,
                    receiver: conversation?.members.filter((member) => member !== user?._id)[0] as string,
                    type: "text",
                    content: newMessage,
                    conversationId: conversation?._id as string,
                };
                
                // Envoyer un message au serveur
                await socket.emit("sendMessage", messageData);
            }

            setMessage(null);
        }
    };


    const handleSendTextMessage = () => {
        if (newMessage) {
            setMessage({
                sender: user?._id as string,
                receiver: conversation?.members.filter((member) => member !== user?._id)[0] as string,
                type: "text",
                content: newMessage
            });

            sendMessage();

            setNewMessage("");
        }
    };


    const handleSendMediaMessage = () => {
        if (media.length > 0) {
            setMessage({
                sender: user?._id as string,
                receiver: conversation?.members.filter((member) => member !== user?._id)[0] as string,
                type: type,
                content: ""
            });

            sendMessage(media[0]);

            setMedia([]);
            setDisplaySendMedia(false);
        }
    }

    useEffect(() => {
        console.log(media[0]);
    }, [media]);

    return (
        <div className="bg-cover bg-no-repeat min-h-screen h-full" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url("/users/bg_images/${user?.bgImage}")`}}>
            {(conversationLoading || messageLoading || !user) && <Loader />}
            {conversationError && <ErrorAlert>{conversationError}</ErrorAlert>}
            {messageError && <ErrorAlert>{messageError}</ErrorAlert>}
            {!conversationLoading && !messageLoading && !messageError && !conversationError && conversation && user && <div className="bg-cover min-h-screen bg-no-repeat h-full">
                {/* The header */}
                <header className="z-10 bg-stone-800 items-center grid grid-cols-4 text-stone-300 fixed top-0 left-0 w-full min-h-20">
                    <Link href="/"><i className="fa-solid fa-arrow-left text-white col-span-1 mx-10 text-xl lg:text-2xl"></i></Link>
                    <div style={{backgroundImage: `url("/users/profile_pictures/${((conversation as Conversation).profilePictures.filter(picture => picture !== user?.profilePicture))[0]}")`}} className="m-6 rounded-full mx-auto w-20 h-20 bg-cover bg-center bg-no-repeat col-span-1"></div>
                    <h1 className="text-xl lg:text-2xl col-span-2">{(conversation as Conversation).names.filter(name => name !== user?.name)}</h1>
                </header>

                <main className="relative py-28 overflow-y-auto" id="main" style={{maxHeight: "calc(100vh - 120px)"}}>
                    {chat.map((message, index) => {
                        return <div key={index} className={`flex my-4 w-full items-center ${(message.sender === user._id)? "justify-end" : "justify-start"}`}>
                            <div className={`border-2 border-black p-2 w-1/2 lg:w-1/4 m-4 rounded-lg ${(message.sender === user._id)? "bg-slate-400 text-black" : "bg-slate-900 text-white"}`}>
                                {message.type === "text" && message.content}
                                {message.type === "image" && <img src={`/messages/medias/${message.content}`} alt="media" className="rounded-lg" />}
                                {message.type === "video" && <video controls className="rounded-lg">
                                    <source src={`/messages/medias/${message.content}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>}
                            </div>
                        </div>
                    })}
                </main>

                {/* The footer */}
                <footer className="z-10 bg-stone-800 items-center grid grid-cols-6 text-stone-300 fixed -bottom-0 left-0 w-full min-h-20">
                    <input type="text" className={`mx-auto my-3 rounded-full w-10/12 col-span-4 text-black px-5 py-2`} placeholder="Write a message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} />
                    <div onClick={() => {setDisplaySendMedia(true);}} className="w-11 h-11 p-1 col-span-1 rounded-full hover:bg-stone-500 flex justify-center items-center cursor-pointer"><i className="fa-solid fa-paperclip text-white mx-10 text-xl lg:text-2xl text-center"></i></div>
                    <div onClick={handleSendTextMessage} className="w-11 h-11 p-1 col-span-1 rounded-full hover:bg-stone-500 flex justify-center items-center cursor-pointer"><i className="fa-solid fa-paper-plane text-white mx-10 text-xl lg:text-2xl text-center"></i></div>
                </footer>

                {displaySendMedia && <div className={`absolute z-10 top-0 left-0 w-full h-full min-h-screen`} style={{background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))"}}>
                    <form className="w-11/12 sm:w-2/4 flex flex-col justify-center gap-3 bg-white mx-auto min-h-96 my-8 rounded-lg fixed top-20 left-4 lg:left-1/4" id="sendMediaForm">
                        <div className="my-3 flex justify-around items-center">
                            <span className={`${(type === "image")? "bg-stone-800": "bg-stone-700"} text-white text-center rounded-md p-2 cursor-pointer`} onClick={() => {setType("image")}}>Image</span>
                            <span className={`${(type === "video")? "bg-stone-800": "bg-stone-700"} text-white text-center rounded-md p-2 cursor-pointer`} onClick={() => {setType("video")}}>Video</span>
                        </div>
                        <div className="w-4/5 mx-auto">
                            <FilePond
                                files={media}
                                onupdatefiles={(fileItems) => {
                                    setMedia(fileItems.map((fileItem) => fileItem.file));
                                }}
                                allowMultiple={false}
                                acceptedFileTypes={[(type === "video")? 'video/mp4' : "image/*"]}
                                maxFiles={1}
                                required
                                name="file" /* sets the file input name, it's filepond by default */
                                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                            />
                        </div>
                        <div className="flex flex-col lg:flex-row justify-around items-center text-white my-5">
                            <button type="button" className={`w-36 rounded-md h-10 bg-stone-800 my-4`} onClick={() => {setDisplaySendMedia(false)}}>Cancel</button>
                            <div onClick={handleSendMediaMessage} className="w-11 h-11 p-1 col-span-1 rounded-full bg-stone-800 flex justify-center items-center cursor-pointer"><i className="fa-solid fa-paper-plane text-white mx-10 text-xl lg:text-2xl text-center"></i></div>
                        </div>
                    </form>
                </div>}
            </div>}
        </div>
    );
}




export default ConversationPage;
"use client"

import ErrorAlert from "@/components/ErrorAlert";
import Loader from "@/components/Loader";
import Conversation from "@/interfaces/conversation";
import User from "@/interfaces/user";
import fetchUserInfos from "@/server/utils/fetchUserInfos";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";






function StoriesPage() {

    const [user, setUser] = useState<User | null>(null);

    const [conversations, setConversations] = useState<Conversation[]>([]);

    const [conversationLoading, setConversationLoading] = useState(true);
    const [conversationError, setConversationError] = useState("");


    const [story, setStory] = useState("");
    const [displayStory, setDisplayStory] = useState(false);



    useEffect(() => {
        async function fetchUser() {
            const user = await fetchUserInfos();

            setUser(user);
        }

        fetchUser();
    }, []);

    useEffect(() => {
        async function fetchConversations() {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/conversation/getAll/${user?._id}`);

                if(response.status === 200) {
                    setConversationLoading(false);
                    setConversations(response.data);

                    console.log("Conversations fetched successfully!");
                }
                else {
                    throw Error("An error in fetch Conversations route ", response.data);
                }
            } catch (error) {
                setConversationLoading(false);
                setConversationError("An unexpected error occurred! Please reload the page and try again.");
                console.log("An error occurred in fetchConversations: ", error);
            }
        }
        if (user) {
            fetchConversations();
        }
    }, [user]);


    return (
        <div>
            <header className="bg-stone-800 flex justify-center items-center text-stone-300 fixed z-10 top-0 left-0 w-full">
                <Link href='/' className="text-xl lg:text-3xl font-bold py-3 rounded-t-lg mx-10 col-span-2 flex items-center"><Image src="/logo.png" alt="My logo" width="50" height="50" className="m-2 w-6 h-6 lg:w-12 lg:h-12" />Echo</Link>
            </header>

            {/* The main content */}
            <main className="relative top-16 lg:top-20 pb-28">
                {conversationLoading && <Loader />}
                {conversationError && <ErrorAlert>{conversationError}</ErrorAlert>}
                {!conversationLoading && conversations.length === 0 && <p className="text-center italic my-20">No conversation found!</p>}
                {!conversationLoading && conversations.length > 0 && !(conversations.some(conversation => conversation.stories.filter(story => story !== user?.story).length !== 0 || conversation.stories.filter(story => story !== user?.story)[0] !== "")) && <p className="text-center italic my-20">No story!</p>}
                {!conversationLoading && conversations.length > 0 && <div className="grid grid-cols-3 lg:grid-cols-5">
                    {conversations.map((conversation, index) => {
                        if(conversation.stories.filter(story => story !== user?.story).length === 0 || conversation.stories.filter(story => story !== user?.story)[0] === "") {
                            return null;
                        }
                        else {
                            return <div className="border border-black flex flex-col items-center" key={index}>
                                <div style={{backgroundImage: `url("/users/profile_pictures/${(conversation.profilePictures.filter(picture => picture !== user?.profilePicture))[0]}")`}} className="m-6 rounded-full mx-auto w-20 h-20 bg-cover bg-center bg-no-repeat cursor-pointer border-4 border-stone-700" onClick={() => {setStory(conversation.stories.filter(story => story !== user?.story)[0]); setDisplayStory(true);}}></div>
                                <h2 className="font-bold text-base text-center lg:text-xl my-2">{conversation.names?.filter(name => name !== user?.name)[0]}</h2>
                            </div>
                        }
                    })}
                </div>}
            </main>
            {displayStory && <div className="fixed top-0 h-full z-20" style={{backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))"}}>
                <i className="text-white m-8 cursor-pointer fa-solid fa-x" aria-hidden="true" onClick={() => {setStory(""); setDisplayStory(false);}}></i>
                <div className="my-20 lg:my-8 flex items-center lg:w-7/12 mx-auto">
                    <video className="w-full border-y border-gray-700" controls autoPlay>
                        <source src={`/users/stories/${story}`} type="video/mp4" />
                    </video>
                </div>
            </div>}

            {/* The footer */}
            <footer className="bg-stone-800 items-center grid grid-cols-3 text-stone-300 fixed -bottom-0 left-0 w-full min-h-20 z-10">
                <Link href="/" className="flex flex-col items-center">
                    <i className="fa-solid fa-comment text-xl text-center lg:text-3xl mx-3 cursor-pointer" aria-hidden="true"></i>
                    <p>Chats</p>
                </Link>
                <Link href="/groups" className="flex flex-col items-center">
                    <i className="fa-solid fa-user-group text-xl text-center lg:text-3xl mx-3 cursor-pointer" aria-hidden="true"></i>
                    <p>Groups</p>
                </Link>
                <Link href="/stories" className="flex flex-col items-center">
                    <i className="fa-solid fa-book text-xl text-center lg:text-3xl mx-3 cursor-pointer" aria-hidden="true"></i>
                    <p>Stories</p>
                </Link>
            </footer>
        </div>
    )
}



export default StoriesPage;
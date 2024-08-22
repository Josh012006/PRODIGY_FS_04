"use client"

import User from "@/interfaces/user";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, FormEvent } from "react";

import fetchUserInfos from "@/server/utils/fetchUserInfos";



import { FilePond, registerPlugin } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import ErrorAlert from "@/components/ErrorAlert";
import Loader from "@/components/Loader";
import axios from "axios";
import Conversation from "@/interfaces/conversation";
import { set } from "mongoose";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)


interface GroupMember {
    _id:string,
    profilePicture: string,
    name: string
}



function AddGroupPage() {

    const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);

    const [file, setFile] = useState<any>([]);

    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState('');

    const [filter, setFilter] = useState("");

    const [user, setUser] = useState<User | null>(null);

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);

    const [conversationLoading, setConversationLoading] = useState(true);
    const [conversationError, setConversationError] = useState("");


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
                const response = await axios.get(`/api/conversation/getAll/${user?._id}`);

                if(response.status === 200) {
                    setConversationLoading(false);
                    setConversations(response.data);
                    setFilteredConversations(response.data);

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


    useEffect(() => {
        if (filter) {
            setFilteredConversations(conversations.filter(conversation => conversation.names.map(name => name.toLowerCase())?.some(value => value !== user?.name.toLowerCase() && value.includes(filter.toLowerCase()))));
        }
        else {
            setFilteredConversations(conversations);
        }
    }, [filter, conversations, user]);


    const handleAddGroup = async (e: FormEvent<HTMLFormElement>) => {
        try {
            
            e.preventDefault();

            setAddLoading(true);
            setAddError('');

            window.scrollTo(0, 0);

            const formData = new FormData(e.target as HTMLFormElement);

            const members = groupMembers.map(member => member._id);

            members.push(user?._id as string);

            formData.append("members", JSON.stringify(members));
            formData.append("media", file[0]);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/group/add`, formData, { headers: {"Content-Type": "multipart/form-data"}, validateStatus: (status) => status >= 200});

            if(response.status === 200) {
                setAddLoading(false);
                console.log("Group added successfully!");
                window.location.href = "/groups";
            }
            else {
                throw Error("An error in add group route ", response.data);
            }

        } catch (error) {
            console.log("An error occurred in handleAddGroup: ", error);
            setAddLoading(false);
            setAddError("An unexpected error occurred! Please reload the page and try again.");
        }
    }



    return(
        <div>
            {/* The header */}
            <header className="z-10 bg-stone-800 flex justify-center items-center text-stone-300 fixed top-0 left-0 w-full">
                <Link href='/' className="text-xl lg:text-3xl font-bold py-3 rounded-t-lg mx-10 col-span-2 flex items-center"><Image src="/logo.png" alt="My logo" width="50" height="50" className="m-2 w-6 h-6 lg:w-12 lg:h-12" />Echo</Link>
            </header>

            {/* The main content */}
            <main className="relative top-28 pb-28">
                <div className="flex justify-center items-center">
                    <h1 className="text-2xl font-bold">Add a new group</h1>
                </div>
                {addLoading && <Loader />}
                {addError && <ErrorAlert>{addError}</ErrorAlert>}
                <div className="flex justify-center items-center">
                    <form className="flex flex-col w-10/12 sm:w-1/4 my-5" onSubmit={handleAddGroup}>
                        <label htmlFor="group-name">Group&apos;s name</label>
                        <input type="text" id="group-name" name="group-name" className="border-2 border-stone-500 rounded-lg p-2 my-2" placeholder="The name of the group" />
                        <label htmlFor="description">Group&apos;s description</label>
                        <textarea id="group-description" name="group-description" className="border-2 border-stone-500 rounded-lg p-3 my-2" placeholder="A description of the group and its objectives!"></textarea>
                        <label htmlFor="media">Group&apos;s picture</label>
                        <div className="w-full my-5">
                            <FilePond
                                files={file}
                                onupdatefiles={(fileItems) => {
                                    setFile(fileItems.map((fileItem) => fileItem.file));
                                }}
                                allowMultiple={false}
                                acceptedFileTypes={['image/*']}
                                maxFiles={1}
                                required
                                name="file" /* sets the file input name, it's filepond by default */
                                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                            />
                        </div>
                        <label htmlFor="members">Group&apos;s members</label>
                        <div className="grid grid-cols-2 items-center min-h-40">
                            {groupMembers.map((member, index) => {
                                return <div key={index} className="flex flex-col justify-center items-center">
                                    <div style={{backgroundImage: `url("/users/profile_pictures/${member.profilePicture?? "unknown.jpg"}")`}} className="m-2 rounded-full mx-auto w-20 h-20 bg-cover bg-center bg-no-repeat col-span-1 cursor-pointer" onClick = {() => {setGroupMembers(groupMembers.filter(memb => memb !== member))}}></div>
                                    <h2 className="font-bold my-2">{member.name}</h2>
                                </div>
                            })}
                        </div>
                        <button className="bg-stone-800 text-stone-300 rounded-lg p-2 my-2" type="submit">Add group</button>
                    </form>
                </div>
                <div>
                    <div className="flex justify-center items-center">
                        <input value={filter} onChange={(e) => {setFilter(e.target.value)}} className="my-3 rounded-full w-10/12 text-black px-5 py-2" placeholder="Search a member to add to the group..." /> 
                    </div>
                    {conversationLoading && <Loader />}
                    {conversationError && <ErrorAlert>{conversationError}</ErrorAlert>}
                    {!conversationLoading && filteredConversations.length === 0 && <p className="text-center italic my-20">No conversation found!</p>}
                    {!conversationLoading && filteredConversations.length > 0 && <div className="grid grid-cols-1 lg:grid-cols-3">
                        {filteredConversations.map((conversation, index) => {
                            return <div key={index} className="grid grid-cols-2 items-center justify-center border-y lg:border-x border-black cursor-pointer" onClick={() => {
                                    if(!groupMembers.some(member => member._id === conversation.members.filter((member: string) => member !== user?._id)[0])) {
                                        setGroupMembers([...groupMembers, { _id: conversation.members.filter((member: string) => member !== user?._id)[0], profilePicture: conversation.profilePictures.filter(picture => picture !== user?.profilePicture)[0], name: conversation.names?.filter(name => name !== user?.name)[0]}])
                                    }
                                }}>
                                <div style={{backgroundImage: `url("/users/profile_pictures/${(conversation.profilePictures.filter((picture: string) => picture !== user?.profilePicture))[0]}")`}} className="m-6 rounded-full mx-auto w-20 h-20 bg-cover bg-center bg-no-repeat col-span-1"></div>
                                <div>
                                    <h2 className="font-bold text-base lg:text-xl my-2">{conversation.names?.filter((name: string) => name !== user?.name)[0]}</h2>
                                </div>
                            </div>
                        })}
                    </div>} 
                </div>
            </main>

            {/* The footer */}
            <footer className="z-10 bg-stone-800 items-center grid grid-cols-3 text-stone-300 fixed -bottom-0 left-0 w-full min-h-20">
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



export default AddGroupPage;
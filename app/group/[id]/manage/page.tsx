"use client"

import ErrorAlert from "@/components/ErrorAlert";
import Loader from "@/components/Loader";
import Conversation from "@/interfaces/conversation";
import Group from "@/interfaces/group";
import User from "@/interfaces/user";
import fetchUserInfos from "@/server/utils/fetchUserInfos";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface GroupMember {
    _id:string,
    profilePicture: string,
    name: string
}



function GroupManagement() {


    const id = useParams().id;

    const [filter, setFilter] = useState("");

    const [group, setGroup] = useState<Group | null>(null);
    const [groupLoading, setGroupLoading] = useState(true);
    const [groupError, setGroupError] = useState("");


    const [members, setMembers] = useState<User[]>([]);
    const [membersLoading, setMembersLoading] = useState(true);
    const [membersError, setMembersError] = useState("");

    const [user, setUser] = useState<User | null>(null);

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);

    const [conversationLoading, setConversationLoading] = useState(true);
    const [conversationError, setConversationError] = useState("");

    const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);

    const[addMembersError, setAddMembersError] = useState("");
    const[addMembersLoading, setAddMembersLoading] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            const user = await fetchUserInfos();

            setUser(user);
        }

        fetchUser();

    }, []);

    useEffect(() => {
        async function fetchGroupInfos() {
            try {
                
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/group/getById/${id}`);

                if(response.status === 200) {
                    setGroup(response.data as Group);
                    setGroupLoading(false);
                }
                else {
                    throw Error("An error occurred in get group by id route ", response.data);
                }

            } catch (error) {
                console.log("An error occurred while fetching the group infos: ", error);
                setGroupLoading(false);
                setGroupError("An unexpected error occurred! Please reload the page!");
            }
        }

        fetchGroupInfos();

    }, [id]);

    useEffect(() => {

        async function fetchMembers() {
            try {
                
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/group/getMembers`, JSON.stringify({tab: group?.members}), {headers: { "Content-Type": "application/json"}, validateStatus: status => status >= 200});

                if(response.status === 200) {
                    setMembers(response.data as User[]);
                    setMembersLoading(false);
                }

                else {
                    throw Error("An error occurred in the route.");
                }


            } catch (error) {
                console.log("An error occurred in fetch members function. Please try again!");
                setMembersLoading(false);
                setMembersError("An unexpected error occurred while searching members! Please reload the page!")
            }
        }

        if(group) {
            fetchMembers();
        }

    }, [group]);

    useEffect(() => {
        async function fetchConversations() {
            try {
                const response = await axios.get(`/api/conversation/getAll/${user?._id}`);
        
                if(response.status === 200) {
                    setConversationLoading(false);
                    setConversations(response.data.filter((conversation: Conversation) => !group?.members.includes(conversation.members.filter(member => member !== user?._id)[0])));
                    setFilteredConversations(response.data.filter((conversation: Conversation) => !group?.members.includes(conversation.members.filter(member => member !== user?._id)[0])));
            
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
    }, [user, group]);

    useEffect(() => {
        if (filter) {
            setFilteredConversations(conversations.filter(conversation => conversation.names.map((name: string) => name.toLowerCase())?.some((value: string) => value !== user?.name.toLowerCase() && value.includes(filter.toLowerCase()))));
        }
        else {
            setFilteredConversations(conversations);
        }
    }, [filter, conversations, user]);



    const handleAddGroupMembers = async () => {
        try {
            setAddMembersError("");
            setAddMembersLoading(true);

            if(groupMembers.length === 0) {
                setAddMembersLoading(false);
                setAddMembersError("Please add the new member!");
                return;
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/group/addMembers`, JSON.stringify({groupId: group?._id, tab: groupMembers.map((member: GroupMember) => {return member._id})}), {headers: { "Content-Type": "application/json"}, validateStatus: status => status >= 200});

            if(response.status === 200) {
                setAddMembersLoading(false);
                window.location.href = `/group/${group?._id}`;
            }
            else {
                throw Error("An error occurred in the route!");
            }


        } catch (error) {
            console.log("An error occurred in add group members!");
            setAddMembersLoading(false);
            setAddMembersError("An unexpected error occurred! Please try again!");
        }
    }

    return(
        <div>
            {(groupLoading || membersLoading || conversationLoading) && <Loader />}
            {groupError && <ErrorAlert>{groupError}</ErrorAlert>}
            {membersError && <ErrorAlert>{membersError}</ErrorAlert>}
            {conversationError && <ErrorAlert>{conversationError}</ErrorAlert>}
            {!groupLoading && !membersLoading && !conversationLoading && user && !groupError && group && <div>
                {/* The header */}
                <header className="z-10 bg-stone-800 items-center grid grid-cols-4 text-stone-300 fixed top-0 left-0 w-full min-h-20">
                    <Link href="/"><i className="fa-solid fa-arrow-left text-white col-span-1 mx-10 text-xl lg:text-2xl"></i></Link>
                    <div style={{backgroundImage: `url("/users/profile_pictures/${group.groupPicture}")`}} className="m-6 rounded-full mx-auto w-20 h-20 bg-cover bg-center bg-no-repeat col-span-1"></div>
                    <div className="col-span-2 flex flex-col justify-center">
                        <h1 className="text-xl lg:text-2xl">{group.name}</h1>
                        <p>{group.members.length} members</p>
                    </div>
                </header>

                <main className="relative py-28">
                    <h1 className="text-center font-bold text-2xl lg:text-3xl my-6">Manage group members</h1>
                    <h2 className="text-center text-lg lg:text-xl my-4">Actual members</h2>
                    <div className="my-4 grid grid-cols-2 lg:grid-cols-5">
                        {members.map((member, index) => {
                            return <div className="border border-black flex flex-col items-center" key={index}>
                                <div style={{backgroundImage: `url("/users/profile_pictures/${member.profilePicture}")`}} className="m-6 rounded-full mx-auto w-20 h-20 bg-cover bg-center bg-no-repeat"></div>
                                <h2 className="font-bold text-base text-center lg:text-xl my-2">{member.name}</h2>
                            </div>
                        })}
                    </div>
                    <div className="my-5">
                        <h2 className="text-center text-lg lg:text-xl my-4">New members</h2>
                        <div className="grid grid-cols-2 items-center min-h-40">
                            {groupMembers.map((member, index) => {
                                return <div key={index} className="flex flex-col justify-center items-center">
                                    <div style={{backgroundImage: `url("/users/profile_pictures/${member.profilePicture?? "unknown.jpg"}")`}} className="m-2 rounded-full mx-auto w-20 h-20 bg-cover bg-center bg-no-repeat col-span-1 cursor-pointer" onClick = {() => {setGroupMembers(groupMembers.filter(memb => memb !== member))}}></div>
                                    <h2 className="font-bold my-2">{member.name}</h2>
                                </div>
                            })}
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <button className="bg-stone-800 text-stone-300 rounded-lg p-2 my-2" type="button" onClick={handleAddGroupMembers}>Add group members</button>
                            {addMembersLoading && <Loader />}
                            {addMembersError && <ErrorAlert>{addMembersError}</ErrorAlert>}
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
                    </div>
                </main>
            </div>}
        </div>
    )
}



export default GroupManagement;
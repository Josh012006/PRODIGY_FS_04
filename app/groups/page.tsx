"use client"




import ErrorAlert from "@/components/ErrorAlert";
import Loader from "@/components/Loader";
import Group from "@/interfaces/group";
import User from "@/interfaces/user";
import fetchUserInfos from "@/server/utils/fetchUserInfos";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";




function GroupsPage() {


    const [user, setUser] = useState<User | null>(null);
    

    const [groups, setGroups] = useState<Group[]>([]);
    const [groupLoading, setGroupLoading] = useState(true);
    const [groupError, setGroupError] = useState("");


    useEffect(() => {
        async function fetchUser() {
            const user = await fetchUserInfos();

            setUser(user);
        }

        fetchUser();
    }, []);

    useEffect(() => {
        async function fetchGroups() {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/group/getAll/${user?._id}`);

                if(response.status === 200) {
                    setGroupLoading(false);
                    setGroups(response.data);

                    console.log("Groups fetched successfully!");
                }
                else {
                    throw Error("An error in fetch Groups route ", response.data);
                }
            } catch (error) {
                setGroupLoading(false);
                setGroupError("An unexpected error occurred! Please reload the page and try again.");
                console.log("An error occurred in fetchGroups: ", error);
            }
        }
        if (user) {
            fetchGroups();
        }
    }, [user]);



    return(
        <div>
            {/* The header */}
            <header className="z-10 bg-stone-800 flex justify-center items-center text-stone-300 fixed top-0 left-0 w-full">
                <Link href='/' className="text-xl lg:text-3xl font-bold py-3 rounded-t-lg mx-10 col-span-2 flex items-center"><Image src="/logo.png" alt="My logo" width="50" height="50" className="m-2 w-6 h-6 lg:w-12 lg:h-12" />Echo</Link>
            </header>

            <main className="relative top-28 pb-28">
                <div className="flex flex-col items-center justify-center">
                    <Link href="/groups/add" className="bg-stone-800 text-stone-300 my-5 rounded-md p-2">Create a new group</Link>
                </div>
                <div>
                    <h1 className="text-xl lg:text-3xl text-center font-bold">Groups</h1>
                    <p className="text-center">Here are the groups you are part of</p>
                </div>
                <div className="my-5">
                    {groupLoading && <Loader />}
                    {groupError && <ErrorAlert>{groupError}</ErrorAlert>}
                    {!groupLoading && groups.length === 0 && <p className="text-center italic my-20">No group found!</p>}
                    {!groupLoading && groups.length > 0 && <div className="grid grid-cols-1 lg:grid-cols-3">
                        {groups.map((group, index) => {
                            return <Link href={`/group/${group._id}`} key={index} className="grid grid-cols-2 items-center justify-center border-y lg:border-x border-black">
                                <div style={{backgroundImage: `url("/users/profile_pictures/${group.groupPicture?? "unknown.jpg"}")`}} className="m-6 rounded-full mx-auto w-20 h-20 bg-cover bg-center bg-no-repeat col-span-1"></div>
                                <div>
                                    <h2 className="font-bold">{group.name}</h2>
                                    <p>{group.description}</p>
                                </div>
                            </Link>
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



export default GroupsPage;
"use client"

import ErrorAlert from "@/components/ErrorAlert";
import Loader from "@/components/Loader";
import User from "@/interfaces/user";
import fetchUserInfos from "@/server/utils/fetchUserInfos";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";







export default function AddPage() {

    const [contact, setContact] = useState("");

    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState("");

    const [searchResult, setSearchResult] = useState<User | null>(null);
    const [addContactLoading, setAddContactLoading] = useState(false);
    const [addContactError, setAddContactError] = useState("");

    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        async function fetchUser() {
            const user = await fetchUserInfos();

            setUser(user);
        }

        fetchUser();
    }, []);


    const handleSearch = async () => {
        try {
            
            setSearchError("");
            setSearchLoading(true);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/findOne`, JSON.stringify({email: contact}), {headers: {"Content-Type" : "application/json"}, validateStatus: status => status >= 200});

            if(response.status === 200) {
                setSearchLoading(false);
                console.log(response.data);
                setSearchResult(response.data);
            }
            else if(response.status === 404) {
                setSearchLoading(false);
                setSearchError("This user doesn't exist!");
            }
            else {
                throw Error(response.data.message);
            }

        } catch (error) {
            console.log("An unexpected error occurred while searching!");
            setSearchLoading(false);
            setSearchError("An unexpected error occurred while searching! Please try again.");
        }
    }

    const handleAddContact = async () => {
        try {

            setAddContactError("");
            setAddContactLoading(true);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/conversation/add`, JSON.stringify({ userId: user?._id, contactId: searchResult?._id, userName: user?.name, contactName: searchResult?.name, userProfile: user?.profilePicture, contactProfile: searchResult?.profilePicture, userStory: user?.story, contactStory: searchResult?.story }), { headers: {"Content-Type": "application/json"}, validateStatus: status => status >=200});

            if(response.status === 200) {
                console.log("Conversation successfully added!")
                setAddContactLoading(false);
                window.location.href = "/";
            }
            else {
                throw Error(response.data.message);
            }

        } catch (error) {
            console.log("An error occurred while trying to add contact!");
            setAddContactLoading(false);
            setAddContactError("An unexpected error occurred! Please try again!");
        }
    }



    return (
        <div>
            {/* The header */}
            <header className="z-10 bg-stone-800 flex justify-center items-center text-stone-300 fixed top-0 left-0 w-full">
                <Link href='/' className="text-xl lg:text-3xl font-bold py-3 rounded-t-lg mx-10 col-span-2 flex items-center"><Image src="/logo.png" alt="My logo" width="50" height="50" className="m-2 w-6 h-6 lg:w-12 lg:h-12" />Echo</Link>
            </header>

            <main className="relative top-28 pb-28">
                <h1 className='text-center font-bold text-xl lg:text-3xl my-5'>Add a new contact</h1>
                <p className="text-center">Each user on the app is identified by its email. So search your contact&apos;s email and your conversation will be added if he exists!</p>
                <div className="flex flex-col my-2 ">
                    <input type="email" className={`mx-auto my-3 rounded-full w-10/12 col-span-7 text-black px-5 py-2`} placeholder="Search a contact..." value={contact} onChange={e => setContact(e.target.value)} />
                    <button type="button" className="w-36 rounded-md text-white bg-stone-800 h-10 hover:bg-stone-700 mt-6 mx-auto" onClick={handleSearch}>Search</button>
                    {searchLoading && <Loader />}
                    {searchError && <ErrorAlert>{searchError}</ErrorAlert>}
                </div>
                {searchResult && <><div className="w-full grid grid-cols-2 border-y border-black">
                    <div style={{backgroundImage: `url("/users/profile_pictures/${(searchResult?.profilePicture === "") ? "unknown.jpg" : searchResult?.profilePicture}")`}} className="m-6 rounded-full mx-auto w-36 h-36 bg-cover bg-center bg-no-repeat col-span-1"></div>
                    <div className="flex flex-col justify-center">
                        <h2 className="font-bold text-base lg:text-xl my-2">{searchResult.username}</h2>
                        <h2 className="text-base lg:text-xl my-2 italic">{searchResult.name}</h2>
                        <p>{searchResult.email}</p>
                        <p>{searchResult.status}</p>
                        <button type="button" onClick={handleAddContact} className="min-w-36 rounded-md text-white bg-stone-800 h-10 hover:bg-stone-700 mt-6 max-w-48">Add contact</button>
                        {addContactLoading && <Loader />}
                        {addContactError && <ErrorAlert>{addContactError}</ErrorAlert>}
                    </div>
                </div>
                </>}
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
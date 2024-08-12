"use client"



import User from "@/interfaces/user";
import fetchUserInfos from "@/server/utils/fetchUserInfos";
import axios from "axios";
import Image from "next/image";

import Link from "next/link";
import { useEffect, useState } from "react";


export default function ProfilePage() {

    const [user, setUser] = useState< User| null>(null);



    const handleLogout = async () => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/logout`, { validateStatus: (status) => status >= 200 });

        if(response.status === 200) {
            console.log("Logging out user");
            window.location.href = '/login';
        }
        else {
            console.log("An error occurred while logging user out!");
            window.location.reload();
        }
    }


    useEffect(() => {
        async function fetchUser() {
            const user = await fetchUserInfos();

            setUser(user);
        }

        fetchUser();
    }, []);

    useEffect(() => {
        console.log(user);
    }, [user]);

    return(
        <div>
            <div className="flex items-center justify-between">
                <Link href="/" className="flex flex-col m-5 text-center"><i className="fa-solid fa-house cursor-pointer text-xl text-center lg:text-3xl " aria-hidden="true"></i> Home</Link>
                <div className="flex flex-col m-5 text-center" onClick={handleLogout}><i className="fa-solid fa-right-from-bracket cursor-pointer text-xl text-center lg:text-3xl" aria-hidden="true"></i> Logout</div>
            </div>
            <h1 className='text-center font-bold text-xl lg:text-3xl my-5'>Your profile page</h1>
            {user && <div>
                <Image src={`/${user?.profilePicture?? "unknown.jpg"}`} alt="profile" width="200" height="200" className="m-6 rounded-full mx-auto w-52 h-52" />
            </div>}
        </div>
    )
}
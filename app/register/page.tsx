"use client"

import ErrorAlert from "@/components/ErrorAlert";
import Loader from "@/components/Loader";


import axios from "axios";
import Link from "next/link";
import { FormEvent, useState } from "react"



export default function RegisterPage() {

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleRegistration = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();

            window.scrollTo(0, 0);
            
            setError('');
            setLoading(true);

            const formData = new FormData(e.target as HTMLFormElement);

            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            const name = formData.get("name") as string;
            const username = formData.get("username") as string;
            const phone = formData.get("phone") as string;


            const user = { email, password, name, username, phone};

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, JSON.stringify(user), {
                headers: {
                    'Content-Type': 'application/json'
                },
                validateStatus: (status: number) => status >=200
            });

            if(response.status === 201) {
                console.log("Successfully registered", response.data);

                setLoading(false);
                window.location.href = '/';
            }
            else if(response.status === 401) {
                console.log("This user already exists!");

                setLoading(false);
                setError("This email is already in use! Please login or use a different one!");

            }
            else {
                throw new Error(response.data.message);
            }

        } catch (error) {
            console.log("An error occured in the registration form ", error);
            setLoading(false);
            setError("Something unexpected occurred. Please try again!")
        }
    }

    return (
        <div className="min-h-screen h-full bg-isabelline py-10">
            <h1 className="text-center text-xl sm:text-3xl pt-20 pb-10 font-bold">Registration Page</h1>
            {error && <ErrorAlert>{error}</ErrorAlert>}
            {loading && <Loader />}
            <form className="bg-stone-500 rounded-lg p-6 w-11/12 sm:w-1/4 flex flex-col mx-auto" onSubmit = {handleRegistration} id="registrationForm">
                <label htmlFor="email" className="text-lg font-semibold my-3">Email</label>
                <input type="email" name="email" id="email" className="rounded-md h-10 p-2 border border-black" placeholder="example@gmail.com" required />
                <label htmlFor="password" className="text-lg font-semibold my-3">Password</label>
                <input type="password" name="password" id="password" className="rounded-md h-10 p-2 border border-black" placeholder="Password" required autoComplete="new-password" />
                <label htmlFor="name" className="text-lg font-semibold my-3">Name</label>
                <input type="text" name="name" id="name" className="rounded-md h-10 p-2 border border-black" placeholder="Real name" required />
                <label htmlFor="username" className="text-lg font-semibold my-3">Username</label>
                <input type="text" name="username" id="username" className="rounded-md h-10 p-2 border border-black" placeholder="Username" required />
                <label htmlFor="phone" className="text-lg font-semibold my-3">Phone</label>
                <input type="tel" name="phone" id="phone" className="rounded-md h-10 p-2 border border-black" placeholder="Phone number" required />
                <button type="submit" form="registrationForm" className="mx-auto w-36 rounded-md bg-stone-800 h-10 hover:bg-stone-700 text-white my-4">Register</button>
                <p>Already have an account? <Link href="/login" className="text-stone-300">Login</Link></p>
            </form>
        </div>
    )
}
"use client"

import ErrorAlert from "@/components/ErrorAlert";
import Loader from "@/components/Loader";
import { set } from "mongoose";
import Link from "next/link";
import { FormEvent, useState } from "react"


export default function RegisterPage() {

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegistration = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            setError('');
            setLoading(true);

            

        } catch (error) {
            
        }
    }

    return (
        <div className="min-h-screen h-full bg-alice-blue py-10">
            <h1 className="text-center text-xl sm:text-3xl pt-20 pb-16 font-bold">Registration Page</h1>
            {error && <ErrorAlert>{error}</ErrorAlert>}
            {loading && <Loader />}
            <form className="bg-crystal rounded-lg p-6 w-11/12 sm:w-1/4 flex flex-col mx-auto" onSubmit = {handleRegistration} id="registrationForm">
                <label htmlFor="email" className="text-lg font-semibold my-3">Email</label>
                <input type="email" name="email" id="email" className="rounded-md h-10 p-2 border border-black" required />
                <label htmlFor="password" className="text-lg font-semibold my-3">Password</label>
                <input type="password" name="password" id="password" className="rounded-md h-10 p-2 border border-black" required />
                <label htmlFor="name" className="text-lg font-semibold my-3">Name</label>
                <input type="text" name="name" id="name" className="rounded-md h-10 p-2 border border-black" required />
                <label htmlFor="username" className="text-lg font-semibold my-3">Username</label>
                <input type="text" name="username" id="username" className="rounded-md h-10 p-2 border border-black" required />
                <label htmlFor="phone" className="text-lg font-semibold my-3">Phone</label>
                <input type="tel" name="phone" id="phone" className="rounded-md h-10 p-2 border border-black" required />
                <button type="submit" form="registrationForm" className="mx-auto w-36 rounded-md bg-charcoal h-10 hover:bg-ocean-call text-white my-4">Register</button>
                <p>Already have an account? <Link href="/Login" className="text-blue-800">Login</Link></p>
            </form>
        </div>
    )
}
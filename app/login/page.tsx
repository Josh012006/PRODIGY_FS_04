"use client"

import ErrorAlert from "@/components/ErrorAlert";
import Loader from "@/components/Loader";
import { login } from "@/redux/slices/authSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import Link from "next/link";
import { FormEvent, useState } from "react"
import { useDispatch } from "react-redux";


export default function LoginPage() {

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch<AppDispatch>();

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();

            setError('');
            setLoading(true);

            const formData = new FormData(e.target as HTMLFormElement);

            const email = formData.get('email') as string;
            const password = formData.get('password') as string;

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, JSON.stringify({ email, password }), {
                headers: {
                    'Content-Type': 'application/json'
                },
                validateStatus: (status) => status >= 200
            });

            if(response.status === 200) {
                console.log("User logged in successfully ", response.data);
                setLoading(false);

                dispatch(login(response.data));

                window.location.href = '/';
            }
            else if(response.status === 404) {
                setLoading(false);
                setError("Invalid credentials!");
            }
            else {
                throw new Error("Something went wrong!");
            }


        } catch (error) {
            console.log("An error occurred in login form submission ", error);
            setLoading(false);
            setError("An error occurred in login form submission");
        }
    }

    return (
        <div className="min-h-screen h-full bg-alice-blue py-10">
            <h1 className="text-center text-xl sm:text-3xl pt-20 pb-10 font-bold">Login Page</h1>
            {error && <ErrorAlert>{error}</ErrorAlert>}
            {loading && <Loader />}
            <form className="bg-crystal rounded-lg p-6 w-11/12 sm:w-1/4 flex flex-col mx-auto" onSubmit = {handleLogin} id="loginForm">
                <label htmlFor="email" className="text-lg font-semibold my-3">Email</label>
                <input type="email" name="email" id="email" className="rounded-md h-10 p-2 border border-black" required />
                <label htmlFor="password" className="text-lg font-semibold my-3">Password</label>
                <input type="password" name="password" id="password" className="rounded-md h-10 p-2 border border-black" required />
                <button type="submit" form="loginForm" className="mx-auto w-36 rounded-md bg-charcoal h-10 hover:bg-ocean-call text-white my-4">Login</button>
                <p>Don&apos;t have an account yet? <Link href="/register" className="text-blue-800">Register</Link></p>
            </form>
        </div>
    )
}
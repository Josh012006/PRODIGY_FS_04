"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {

  const [filter, setFilter] = useState("");

  const router = useRouter();

  const handleFilter = () => {

  }

  const handleOptionsDisplay = () => {

  }


  return (
    <div>
      <header className="bg-stone-800 grid grid-cols-12 items-center text-stone-300">
        <h1 className="text-xl lg:text-3xl font-bold py-3 rounded-t-lg mx-10 col-span-2 flex items-center "><Image src="/logo.png" alt="My logo" width="50" height="50" className="m-2" />Echo</h1>
        <input className={`mx-5 my-3 rounded-full w-full col-span-7 text-black px-5 py-2`} placeholder="Search a discussion..." value={filter} onChange={e => setFilter(e.target.value)} />
        <div className="col-span-3 mx-5 grid grid-cols-2">
          <i className="fa-solid fa-plus text-xl text-center lg:text-3xl mx-3 cursor-pointer" aria-hidden="true" onClick={handleOptionsDisplay}></i>
          <i className="fa-solid fa-user text-xl text-center lg:text-3xl mx-3 cursor-pointer" aria-hidden="true" onClick={() => {router.push('/profile')}}></i>
        </div>
      </header>
    </div>
  )
}
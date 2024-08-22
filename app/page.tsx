"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Conversation from "@/interfaces/conversation";
import fetchUserInfos from "@/server/utils/fetchUserInfos";
import User from "@/interfaces/user";
import axios from "axios";
import Loader from "@/components/Loader";
import ErrorAlert from "@/components/ErrorAlert";

export default function HomePage() {

  const [filter, setFilter] = useState("");

  const router = useRouter();

  const [displaySearchBar, setDisplaySearchBar] = useState(false);
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




  return (
    <div>
      {/* The header on large screens */}
      <header className="z-10 bg-stone-800 grid-cols-12 items-center text-stone-300 fixed top-0 left-0 w-full hidden lg:grid">
        <h1 className="text-xl lg:text-3xl font-bold py-3 rounded-t-lg mx-10 col-span-2 flex items-center "><Image src="/logo.png" alt="My logo" width="50" height="50" className="m-2 w-6 h-6 lg:w-12 lg:h-12" />Echo</h1>
        <input type="text" className={`mx-5 my-3 rounded-full w-full col-span-7 text-black px-5 py-2`} placeholder="Search a discussion..." value={filter} onChange={e => setFilter(e.target.value)} />
        <div className="col-span-3 mx-5 grid grid-cols-2">
          <i className="fa-solid fa-plus text-xl text-center lg:text-3xl mx-3 cursor-pointer" aria-hidden="true" onClick={() => {router.push('/add')}}></i>
          <i className="fa-solid fa-user text-xl text-center lg:text-3xl mx-3 cursor-pointer" aria-hidden="true" onClick={() => {router.push('/profile')}}></i>
        </div>
      </header>

      {/* The header on small screens */}
      <header className="z-10 bg-stone-800 flex flex-col text-stone-300 fixed top-0 left-0 w-full lg:hidden">
        <div className="grid grid-cols-3 items-center">
          <h1 className="text-xl lg:text-3xl font-bold py-3 rounded-t-lg mx-10 col-span-1 flex items-center "><Image src="/logo.png" alt="My logo" width="50" height="50" className="m-2 w-6 h-6 lg:w-12 lg:h-12" />Echo</h1>
          <div className="col-span-2 mx-5 grid grid-cols-3">
            <i className="fa-solid fa-magnifying-glass text-xl text-center lg:text-3xl mx-3 cursor-pointer" aria-hidden="true" onClick={() => {setDisplaySearchBar(!displaySearchBar)}}></i>
            <i className="fa-solid fa-plus text-xl text-center lg:text-3xl mx-3 cursor-pointer" aria-hidden="true" onClick={() => {router.push('/add')}}></i>
            <i className="fa-solid fa-user text-xl text-center lg:text-3xl mx-3 cursor-pointer" aria-hidden="true" onClick={() => {router.push('/profile')}}></i>
          </div>
        </div>
        <div className={`${displaySearchBar? "flex" : "hidden"}`}>
          <input type="text" className={`mx-auto my-3 rounded-full w-10/12 col-span-7 text-black px-5 py-2`} placeholder="Search a discussion..." value={filter} onChange={e => setFilter(e.target.value)} />
        </div>
      </header>

      <main className={`relative ${(displaySearchBar? "top-[124px]": "top-16")} lg:top-[88px]`}>
        {conversationLoading && <Loader />}
        {conversationError && <ErrorAlert>{conversationError}</ErrorAlert>}
        {!conversationLoading && filteredConversations.length === 0 && <p className="text-center italic my-20">No conversation found!</p>}
        {!conversationLoading && filteredConversations.length > 0 && <div className="grid grid-cols-1 lg:grid-cols-3">
          {filteredConversations.map((conversation, index) => {
              return <Link href={`/conversation/${conversation._id}`} key={index} className="grid grid-cols-2 items-center justify-center border-y lg:border-x border-black">
                <div style={{backgroundImage: `url("/users/profile_pictures/${(conversation.profilePictures.filter(picture => picture !== user?.profilePicture))[0]}")`}} className="m-6 rounded-full mx-auto w-20 h-20 bg-cover bg-center bg-no-repeat col-span-1"></div>
                <div>
                  <h2 className="font-bold text-base lg:text-xl my-2">{conversation.names?.filter(name => name !== user?.name)[0]}</h2>
                </div>
              </Link>
          })}
        </div>}
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
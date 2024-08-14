"use client"



import ErrorAlert from "@/components/ErrorAlert";
import Loader from "@/components/Loader";
import User from "@/interfaces/user";
import fetchUserInfos from "@/server/utils/fetchUserInfos";
import axios from "axios";
import Image from "next/image";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";


import { FilePond, registerPlugin } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)


export default function ProfilePage() {

    const [user, setUser] = useState< User| null>(null);


    // Managing profile picture change
    const [displayProfPicModal, setDisplayProfPicModal] = useState(false);
    const [disableCancel, setDisableCancel] = useState(false);
    const [cancelBg, setCancelBg] = useState("bg-stone-800");
    const [loadingProfPicChange, setLoadingProfPicChange] = useState(false);
    const [profPicChangeError, setProfPicChangeError] = useState("");
    const [profPicFile, setProfPicFile] = useState<any[]>([]);

    const [deletionProfPicLoading, setDeletionProfPicLoading] = useState(false);


    // Managing profile picture display
    const [displayProfPic, setDisplayProfPic] = useState(false);

    //Managing modification of infos
    const [modifyInfos, setModifyInfos] = useState(false);
    const [modifyLoading, setModifyLoading] = useState(false);
    const [modifyError, setModifyError] = useState("");
    const [disableCancel1, setDisableCancel1] = useState(false);
    const [cancelBg1, setCancelBg1] = useState("bg-stone-800");

    const [usernameModify, setUsernameModify] = useState('');
    const [modifyUsernameLoading, setModifyUsernameLoading] = useState(false);
    const [phoneModify, setPhoneModify] = useState('');
    const [modifyPhoneLoading, setModifyPhoneLoading] = useState(false);
    const [statusModify, setStatusModify] = useState('');
    const [modifyStatusLoading, setModifyStatusLoading] = useState(false);
    const [statusPrivacyModify, setStatusPrivacyModify] = useState<{ privacy: string }>({ privacy: 'public' });
    const [modifyStatusPrivacyLoading, setModifyStatusPrivacyLoading] = useState(false);

    const [storyDeletionLoading, setStoryDeletionLoading] = useState(false);
    const [displayStoryChangeModal, setDisplayStoryChangeModal] = useState(false);
    const [story, setStory] = useState<any[]>([]);
    const [loadingStoryChange, setLoadingStoryChange] = useState(false);
    const [storyChangeError, setStoryChangeError] = useState("");
    const [disableCancel2, setDisableCancel2] = useState(false);
    const [cancelBg2, setCancelBg2] = useState("bg-stone-800");

    const [bgImageDeletionLoading, setBgImageDeletionLoading] = useState(false);
    const [loadingBgImageChange, setLoadingBgImageChange] = useState(false);
    const [bgImageChangeError, setBgImageChangeError] = useState("");
    const [bgImageFile, setBgImageFile] = useState<any[]>([]);
    const [disableCancel3, setDisableCancel3] = useState(false);
    const [cancelBg3, setCancelBg3] = useState("bg-stone-800");
    const [displayBgImageModal, setDisplayBgImageModal] = useState(false);





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
        setUsernameModify(user?.username?? "");
        setPhoneModify(user?.phone?? "");
        setStatusModify(user?.status?? "");
        setStatusPrivacyModify({privacy: user?.statusPrivacy?? "public"});

    }, [user]);


    const handleProfPicChange = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();

            setDisableCancel(true);
            setCancelBg("bg-stone-700");
            setProfPicChangeError("");
            setLoadingProfPicChange(true);
            
            const formData = new FormData();
            formData.append("_id", user?._id as string);
            formData.append("oldFile", user?.profilePicture as string);
            formData.append("file", profPicFile[0]);

            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/user/update/profPicture`, formData, { headers: { "Content-Type": "multipart/formData"}, validateStatus: status => status >=200});

            if(response.status === 200) {
                setLoadingProfPicChange(false);
                window.location.reload();
            }

            else {
                throw Error(response.data);
            }

        } catch (error) {
            console.log("An error occurred while changing profile picture ", error);
            setDisableCancel(false);
            setCancelBg("bg-stone-800");
            setLoadingProfPicChange(false);
            setProfPicChangeError("An unexpected error occurred. Please try again later!");
        }
    }

    const handleProfPicDeletion = async () => {
        try {
            setDeletionProfPicLoading(true);

            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/user/update/profPicture/delete`, JSON.stringify({_id: user?._id, oldFile: user?.profilePicture}), { headers: {"Content-Type": "application/json"}, validateStatus: status => status >=200});

            if(response.status === 200) {
                console.log('Profile picture deleted successfully!');
                setDeletionProfPicLoading(false);
                window.location.reload();
            }
            else {
                throw Error(response.data.message);
            }

        } catch (error) {
            setDeletionProfPicLoading(false);
            console.log('An error occurred while trying to delete profile picture ', error);
            window.location.reload();
        }
    }


    // Modify Infos
    const handleModifyInfos = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();

            setDisableCancel1(true);
            setCancelBg1("bg-stone-700");
            setModifyError("");
            setModifyLoading(true);

            const formData = new FormData(e.target as HTMLFormElement);


            if(formData.get("new-password") !== formData.get("confirm-password")) {
                setDisableCancel1(false);
                setCancelBg1("bg-stone-800");
                setModifyLoading(false);
                setModifyError("The passwords must be the same!");
            } else {

                const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/user/update/password`, JSON.stringify({_id: user?._id, newPassword: formData.get("new-password"), password: formData.get("old-password")}), {headers: {"Content-Type": "application/json"}, validateStatus: status => status >= 200});

                if(response.status === 200) {
                    setModifyLoading(false);
                    window.location.reload();
                }
                else if(response.status === 401) {
                    setDisableCancel1(false);
                    setCancelBg1("bg-stone-800");
                    setModifyLoading(false);
                    setModifyError("Invalid password!");
                }
                else {
                    throw new Error(response.data.message);
                }

            }


        } catch (error) {
            console.log("An error occurred in modification ", error);
            setDisableCancel1(false);
            setCancelBg1("bg-stone-800");
            setModifyLoading(false);
            setModifyError("An unexpected error occurred. Please try again later!");
        }
    }


    const handleUsernameModify = async () => {
        try {
            
            setModifyUsernameLoading(true);

            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/user/update/username`, JSON.stringify({_id: user?._id, username: usernameModify}), {headers: {"Content-Type": "application/json"}, validateStatus: status => status >= 200});

            if(response.status === 200) {
                setModifyUsernameLoading(false);
                window.location.reload();
            }
            else {
                throw new Error(response.data.message);
            }

        } catch (error) {
            setModifyUsernameLoading(false);
            console.log('An error occurred while modifying username ', error);
            window.location.reload();
        }
    }

    const handlePhoneModify = async () => {
        try {
            
            setModifyPhoneLoading(true);

            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/user/update/phone`, JSON.stringify({_id: user?._id, phone: phoneModify}), {headers: {"Content-Type": "application/json"}, validateStatus: status => status >= 200});

            if(response.status === 200) {
                setModifyPhoneLoading(false);
                window.location.reload();
            }
            else {
                throw new Error(response.data.message);
            }

        } catch (error) {
            setModifyPhoneLoading(false);
            console.log('An error occurred while modifying phone number ', error);
            window.location.reload();
        }
    }

    // Modification of status
    const handleStatusModify = async () => {
        try {
            
            setModifyStatusLoading(true);

            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/user/update/status`, JSON.stringify({_id: user?._id, status: statusModify}), {headers: {"Content-Type": "application/json"}, validateStatus: status => status >= 200});

            if(response.status === 200) {
                setModifyStatusLoading(false);
                window.location.reload();
            }
            else {
                throw new Error(response.data.message);
            }

        } catch (error) {
            setModifyStatusLoading(false);
            console.log('An error occurred while modifying status ', error);
            window.location.reload();
        }
    }

    // Modify status privacy 
    const handleChange = (event: any) => {
        setStatusPrivacyModify({ privacy: event.target.value });
    }

    const handleStatusPrivacyModify = async () => {
        try {
            
            setModifyStatusPrivacyLoading(true);

            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/user/update/statusPrivacy`, JSON.stringify({_id: user?._id, statusPrivacy: statusPrivacyModify.privacy}), {headers: {"Content-Type": "application/json"}, validateStatus: status => status >= 200});

            if(response.status === 200) {
                setModifyStatusPrivacyLoading(false);
                window.location.reload();
            }
            else {
                throw new Error(response.data.message);
            }

        } catch (error) {
            setModifyStatusPrivacyLoading(false);
            console.log('An error occurred while modifying status privacy ', error);
            window.location.reload();
        }
    }


    // Managing the story here
    const handleStoryDeletion = async () => {
        try {
            
            setStoryDeletionLoading(true);

            const formData = new FormData();

            formData.append("_id", user?._id as string);
            formData.append("oldStory", user?.story as string);
            formData.append("story", "");

            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/user/update/story`, formData, {headers: {"Content-Type": "multipart/form-data"}, validateStatus: status => status >= 200});

            if(response.status === 200) {
                setStoryDeletionLoading(false);
                window.location.reload();
            }
            else {
                throw new Error(response.data.message);
            }

        } catch (error) {
            setStoryDeletionLoading(false);
            console.log('An error occurred while deleting story ', error);
            window.location.reload();
        }    
    }

    const handleStoryModification = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();

            setDisableCancel2(true);
            setCancelBg2("bg-stone-700");
            setStoryChangeError("");
            setLoadingStoryChange(true);

            const formData = new FormData();
            formData.append("_id", user?._id as string);
            formData.append("oldStory", user?.story as string);
            formData.append("story", story[0]);

            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/user/update/story`, formData, { headers: { "Content-Type": "multipart/form-data"}, validateStatus: status => status >=200});

            if(response.status === 200) {
                setLoadingStoryChange(false);
                window.location.reload();
            }

            else {
                throw Error(response.data);
            }

        } catch (error) {
            console.log("An error occurred in modification of story ", error);
            setDisableCancel2(false);
            setCancelBg2("bg-stone-800");
            setLoadingStoryChange(false);
            setStoryChangeError("An unexpected error occurred. Please try again later!");
        }
    }


    // Modification and deletion of background Image
    const handleBgImageDeletion = async () => {
        try {
            
            setBgImageDeletionLoading(true);

            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/user/update/bgImage/delete`, JSON.stringify({_id: user?._id, oldBg: user?.bgImage}), { headers: { "Content-Type": "application/json"}, validateStatus: status => status >=200});

            if(response.status === 200) {
                console.log("Bg image deleted successfully");
                setBgImageDeletionLoading(false);
                window.location.reload();
            }
            else {
                throw Error(response.data.message);
            }

        } catch (error) {
            setBgImageDeletionLoading(false);
            console.log("An error occurred while deleting bg image", error);
            window.location.reload();
        }
    }


    const handleBgImageChange = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();

            setDisableCancel3(true);
            setCancelBg3("bg-stone-700");
            setBgImageChangeError("");
            setLoadingBgImageChange(true);
            
            const formData = new FormData();
            formData.append("_id", user?._id as string);
            formData.append("oldBg", user?.bgImage as string);
            formData.append("bg", bgImageFile[0]);

            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/user/update/bgImage`, formData, { headers: { "Content-Type": "multipart/form-data"}, validateStatus: status => status >=200});

            if(response.status === 200) {
                setLoadingBgImageChange(false);
                window.location.reload();
            }

            else {
                throw Error(response.data);
            }

        } catch (error) {
            console.log("An error occurred while changing profile picture ", error);
            setDisableCancel3(false);
            setCancelBg3("bg-stone-800");
            setLoadingBgImageChange(false);
            setBgImageChangeError("An unexpected error occurred. Please try again later!");
        }
    }

    return(
        <div className="relative">
            <div className="flex items-center justify-between">
                <Link href="/" className="flex flex-col m-5 text-center"><i className="fa-solid fa-house cursor-pointer text-xl text-center lg:text-3xl " aria-hidden="true"></i> Home</Link>
                <div className="flex flex-col m-5 text-center" onClick={handleLogout}><i className="fa-solid fa-right-from-bracket cursor-pointer text-xl text-center lg:text-3xl" aria-hidden="true"></i> Logout</div>
            </div>
            <h1 className='text-center font-bold text-xl lg:text-3xl my-5'>Your profile page</h1>
            {!user && <Loader />}
            {user && <div>
                <div style={{backgroundImage: `url("/users/profile_pictures/${(user?.profilePicture === "") ? "unknown.jpg" : user?.profilePicture}")`}} className="m-6 rounded-full mx-auto w-52 h-52 cursor-pointer bg-cover bg-center bg-no-repeat" onClick = {() => {setDisplayProfPic(true)}}></div>
                {displayProfPic && <div className="absolute z-10 top-0 left-0 w-full min-h-full h-screen" style={{background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))"}}>
                    <div className="w-11/12 sm:w-2/4 bg-white mx-auto min-h-96 my-40 rounded-lg relative flex flex-col justify-center items-center p-5">
                        <img src={`/users/profile_pictures/${(user?.profilePicture === "") ? "unknown.jpg" : user?.profilePicture}`} alt="profile" className="rounded-lg max-h-72" />
                        <button type="button" className="w-36 rounded-md text-white bg-stone-800 h-10 hover:bg-stone-700 mt-6 mx-auto" onClick={() => {setDisplayProfPic(false)}}>Cancel</button>
                    </div>
                </div>}
                <div className="flex flex-col lg:flex-row items-center gap-4">
                    <div className="flex justify-center items-center text-white bg-stone-800 hover:bg-stone-700 cursor-pointer text-center p-2 w-52 mx-auto rounded-full" onClick={() => {setDisplayProfPicModal(true)}}>
                        <i className="fa-solid fa-image cursor-pointer text-xl text-center lg:text-2xl m-3" aria-hidden="true"></i>
                        <p>Change profile picture</p>
                    </div>
                    <div className="flex justify-center items-center text-white bg-stone-800 hover:bg-stone-700 cursor-pointer text-center p-2 w-52 mx-auto rounded-full" onClick={handleProfPicDeletion}>
                        <i className="fa-solid fa-trash cursor-pointer text-xl text-center lg:text-2xl m-3" aria-hidden="true"></i>
                        <p>Delete profile picture</p>
                    </div>
                </div>
                {deletionProfPicLoading && <Loader />}
                {displayProfPicModal && <div className={`absolute z-10 top-0 left-0 w-full min-h-full h-screen`} style={{background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))"}}>
                    <form className="w-11/12 sm:w-2/4 flex flex-col justify-center gap-3 bg-white mx-auto min-h-96 my-20 rounded-lg fixed top-20 left-4 lg:left-1/4" id="changeProfPicForm" onSubmit = {handleProfPicChange}>
                        <div className="w-4/5 mx-auto my-5">
                            <FilePond
                                files={profPicFile}
                                onupdatefiles={(fileItems) => {
                                    setProfPicFile(fileItems.map((fileItem) => fileItem.file));
                                }}
                                allowMultiple={false}
                                acceptedFileTypes={['image/*']}
                                maxFiles={1}
                                required
                                name="file" /* sets the file input name, it's filepond by default */
                                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                            />
                        </div>
                        <div className="flex flex-col lg:flex-row justify-around items-center text-white my-5">
                            <button type="button" disabled={disableCancel} className={`w-36 rounded-md ${cancelBg} h-10 hover:bg-stone-700 my-4 disabled:bg-stone-700`} onClick={() => {setDisplayProfPicModal(false)}}>Cancel</button>
                            <button type="submit" className="w-36 rounded-md bg-stone-800 h-10 hover:bg-stone-700 my-4" form="changeProfPicForm">Submit</button>
                        </div>
                        {loadingProfPicChange && <Loader />}
                        {profPicChangeError && <ErrorAlert>{profPicChangeError}</ErrorAlert>}
                    </form>
                </div>}
                <br />
                <h1 className="text-base lg:text-xl font-bold text-center">Personal information</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center py-5">
                    <div className="flex flex-col text-center w-56 mx-auto my-3 h-56">
                        <label className="my-2">Your username</label>
                        <input type="text" placeholder="Your username" className="bg-white rounded-md border-0 h-10 p-2" value={usernameModify} onChange={(e) => {setUsernameModify(e.target.value)}} />
                        <button type="button" className="w-36 rounded-md text-white bg-stone-800 h-10 hover:bg-stone-700 mt-6 mx-auto" onClick={handleUsernameModify}>Apply modification</button>
                        {modifyUsernameLoading && <Loader />}
                    </div>
                    <div className="flex flex-col text-center w-56 mx-auto my-3 h-56">
                        <label className="my-2">Your phone number</label>
                        <input type="tel" placeholder="Your phone number" className="bg-white rounded-md border-0 h-10 p-2" value={phoneModify} onChange={(e) => {setPhoneModify(e.target.value)}} />
                        <button type="button" className="w-36 rounded-md text-white bg-stone-800 h-10 hover:bg-stone-700 mt-6 mx-auto" onClick={handlePhoneModify}>Apply modification</button>
                        {modifyPhoneLoading && <Loader />}
                    </div>
                    <div className="flex flex-col text-center w-56 mx-auto my-3">
                        <label className="my-2">Your email</label>
                        <input type="email" placeholder="Your email" className="bg-white rounded-md border-0 h-10 p-2" value={user.email} readOnly />
                    </div>
                    <div className="flex flex-col items-center py-6"><button type="button" className="w-36 p-2 rounded-md text-white bg-stone-800 min-h-10 hover:bg-stone-700  mx-auto" onClick={() => {setModifyInfos(true)}}>Modify your password</button></div>
                    {modifyInfos && <div className={`absolute z-10 top-0 left-0 w-full min-h-full h-screen`} style={{background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))"}}>
                        <form className="w-11/12 sm:w-2/4 flex flex-col justify-center gap-3 bg-white mx-auto min-h-96 my-20 rounded-lg fixed top-20 left-4 lg:left-1/4" id="modifyInfosForm" onSubmit = {handleModifyInfos}>
                            <div className="grid grid-cols-1 items-center">
                                <div className="flex flex-col w-10/12 mx-auto my-3">
                                    <label className="my-2">Your password</label>
                                    <input type="password" name="old-password" placeholder="Your old password" className="bg-white rounded-md border border-black h-10 p-2" />
                                </div>
                                <div className="flex flex-col w-10/12 mx-auto my-3">
                                    <label className="my-2">New password</label>
                                    <input type="password" name="new-password" placeholder="Your new password" className="bg-white rounded-md border border-black h-10 p-2" />
                                </div>
                                <div className="flex flex-col w-10/12 mx-auto my-3">
                                    <label className="my-2">Confirm New password</label>
                                    <input type="password" name="confirm-password" placeholder="Confirm new password" className="bg-white rounded-md border border-black h-10 p-2" />
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row justify-around items-center text-white my-5">
                                <button type="button" disabled={disableCancel1} className={`w-36 rounded-md ${cancelBg1} h-10 hover:bg-stone-700 my-4 disabled:bg-stone-700`} onClick={() => {setModifyInfos(false)}}>Cancel</button>
                                <button type="submit" className="w-36 rounded-md bg-stone-800 h-10 hover:bg-stone-700 my-4" form="modifyInfosForm">Submit</button>
                            </div>
                            {modifyLoading && <Loader />}
                            {modifyError && <ErrorAlert>{modifyError}</ErrorAlert>}
                        </form>
                    </div>}
                </div>
                <br />
                <br />
                <h1 className="text-base lg:text-xl font-bold text-center">Conversation parameters</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
                    <div className="flex flex-col text-center w-56 mx-auto my-3">
                        <label className="my-2">Your status</label>
                        <input type="text" placeholder="Your status" className="bg-white rounded-md border-0 h-10 p-2" value={statusModify} onChange={(e) => {setStatusModify(e.target.value)}} />
                        <button type="button" className="w-36 rounded-md text-white bg-stone-800 h-10 hover:bg-stone-700 mt-6 mx-auto" onClick={handleStatusModify}>Apply modification</button>
                        {modifyStatusLoading && <Loader />}
                    </div>
                    <div className="flex flex-col text-center w-56 mx-auto my-3">
                        <label className="my-2">Your presence privacy (It will determine if users can see when you&apos;re connected)</label>
                        <div className="flex justify-around items-center">
                            <label>
                                <span className="font-bold italic m-2">Public:</span>
                                <input
                                    type="radio"
                                    value="public"
                                    checked={statusPrivacyModify.privacy === 'public'}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                <span className="font-bold italic m-2">Private:</span>
                                <input
                                    type="radio"
                                    value="private"
                                    checked={statusPrivacyModify.privacy === 'private'}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <button type="button" className="w-36 rounded-md text-white bg-stone-800 h-10 hover:bg-stone-700 mt-6 mx-auto" onClick={handleStatusPrivacyModify}>Apply modification</button>
                        {modifyStatusPrivacyLoading && <Loader />}
                    </div>
                    <div className="flex flex-col text-center w-10/12 mx-auto my-3">
                        <label className="my-2">Your story</label>
                        <div className="w-full h-80 bg-white rounded-lg p-3 flex flex-col items-center justify-center">
                            {!user.story && <p className="italic">No story</p>}
                            {user.story && <video controls className="w-full h-full">
                                <source src={`/users/stories/${user.story}`} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>}
                        </div>
                        <div className="flex flex-col lg:flex-row justify-around items-center">
                            <button type="button" className="w-36 rounded-md text-white bg-stone-800 h-10 hover:bg-stone-700 mt-6 mx-auto" onClick={handleStoryDeletion}>Delete story</button>
                            <button type="button" className="w-36 rounded-md text-white bg-stone-800 h-10 hover:bg-stone-700 mt-6 mx-auto" onClick={() => {setDisplayStoryChangeModal(true)}}>Upload new story</button>
                        </div>
                        {displayStoryChangeModal && <div className={`absolute z-10 top-0 left-0 w-full min-h-full h-screen`} style={{background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))"}}>
                            <form className="w-11/12 sm:w-2/4 flex flex-col justify-center gap-3 bg-white mx-auto min-h-96 my-20 rounded-lg fixed top-20 left-4 lg:left-1/4" id="changeStoryForm" onSubmit = {handleStoryModification}>
                                <div className="w-4/5 mx-auto my-5">
                                    <FilePond
                                        files={story}
                                        onupdatefiles={(fileItems) => {
                                            setStory(fileItems.map((fileItem) => fileItem.file));
                                        }}
                                        allowMultiple={false}
                                        acceptedFileTypes={['video/mp4']}
                                        maxFiles={1}
                                        required
                                        name="file" /* sets the file input name, it's filepond by default */
                                        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                    />
                                </div>
                                <div className="flex flex-col lg:flex-row justify-around items-center text-white my-5">
                                    <button type="button" disabled={disableCancel2} className={`w-36 rounded-md ${cancelBg2} h-10 hover:bg-stone-700 my-4 disabled:bg-stone-700`} onClick={() => {setDisplayStoryChangeModal(false)}}>Cancel</button>
                                    <button type="submit" className="w-36 rounded-md bg-stone-800 h-10 hover:bg-stone-700 my-4" form="changeStoryForm">Submit</button>
                                </div>
                                {loadingStoryChange && <Loader />}
                                {storyChangeError && <ErrorAlert>{storyChangeError}</ErrorAlert>}
                            </form>
                        </div>}
                        {storyDeletionLoading && <Loader />}
                    </div>
                    <div className="flex flex-col text-center w-10/12 mx-auto my-3">
                        <label className="my-2">Your conversation&apos;s background image</label>
                        <div className="w-full h-80 bg-white rounded-lg p-3 flex flex-col items-center justify-center">
                            {user.bgImage && <img src={`/users/bg_images/${(user?.bgImage === "") ? "bg.jpg" : user?.bgImage}`} alt="bg" className="rounded-lg max-h-72" />}
                        </div>
                        <div className="flex flex-col lg:flex-row justify-around items-center">
                            <button type="button" className="w-40 rounded-md text-white bg-stone-800 h-12 hover:bg-stone-700 mt-6 mx-auto" onClick={handleBgImageDeletion}>Use default background image</button>
                            <button type="button" className="w-40 rounded-md text-white bg-stone-800 h-12 hover:bg-stone-700 mt-6 mx-auto" onClick={() => {setDisplayBgImageModal(true)}}>Change background image</button>
                        </div>
                        {displayBgImageModal && <div className={`absolute z-10 top-0 left-0 w-full min-h-full h-screen`} style={{background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))"}}>
                            <form className="w-11/12 sm:w-2/4 flex flex-col justify-center gap-3 bg-white mx-auto min-h-96 my-20 rounded-lg fixed top-20 left-4 lg:left-1/4" id="changeBgImageForm" onSubmit = {handleBgImageChange}>
                                <div className="w-4/5 mx-auto my-5">
                                    <FilePond
                                        files={bgImageFile}
                                        onupdatefiles={(fileItems) => {
                                            setBgImageFile(fileItems.map((fileItem) => fileItem.file));
                                        }}
                                        allowMultiple={false}
                                        acceptedFileTypes={['image/*']}
                                        maxFiles={1}
                                        required
                                        name="file" /* sets the file input name, it's filepond by default */
                                        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                    />
                                </div>
                                <div className="flex flex-col lg:flex-row justify-around items-center text-white my-5">
                                    <button type="button" disabled={disableCancel3} className={`w-36 rounded-md ${cancelBg3} h-10 hover:bg-stone-700 my-4 disabled:bg-stone-700`} onClick={() => {setDisplayBgImageModal(false)}}>Cancel</button>
                                    <button type="submit" className="w-36 rounded-md bg-stone-800 h-10 hover:bg-stone-700 my-4" form="changeBgImageForm">Submit</button>
                                </div>
                                {loadingBgImageChange && <Loader />}
                                {bgImageChangeError && <ErrorAlert>{bgImageChangeError}</ErrorAlert>}
                            </form>
                        </div>}
                        {bgImageDeletionLoading && <Loader />}
                    </div>
                </div>
            </div>}
        </div>
    )
}
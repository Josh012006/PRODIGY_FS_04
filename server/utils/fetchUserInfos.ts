import axios from "axios";

async function fetchUserInfos() {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, { validateStatus: (status) => status >= 200 });

        if(response.status === 200) {
            return(response.data);
        }
        else {
            console.log("An error occurred while fetching user infos!");
            return null;
        }
    } catch (error) {
        console.log("An error occurred while fetching user infos ", error);
        return null;
    }
}


export default fetchUserInfos;


export default interface User {
    _id?: string
    email: string
    password: string
    name: string,
    username: string,
    phone: string,
    profilePicture: string,
    bgImage: string,
    story: string,
    status: string
    present : boolean,
    statusPrivacy: string
    contacts: string[],
    conversations: string[],
    groups: string[],
    createdAt?: Date,
    updatedAt?: Date,
    __v?: number
}
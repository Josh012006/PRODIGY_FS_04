export default interface Conversation {
    _id?: string,
    names: string[],
    profilePictures: string[],
    stories: string[],
    members: string[],
    messages: string[],
    medias: string[],
    createdAt: Date,
    updatedAt: Date,
    __v: number
}
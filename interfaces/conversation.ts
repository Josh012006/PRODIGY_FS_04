export default interface Conversation {
    _id?: string,
    members: string[],
    messages: string[],
    medias: string[],
    createdAt: Date,
    updatedAt: Date,
    __v: number
}
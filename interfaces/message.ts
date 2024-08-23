export default interface Message {
    _id?: string,
    sender: string,
    receiver: string | string[],
    type: string,
    content: string,
    createdAt?: Date,
    updatedAt?: Date,
    __v?: number
}
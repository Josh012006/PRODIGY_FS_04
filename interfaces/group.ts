export default interface Group {
    _id?: string,
    name: string,
    description: string,
    members: string[],
    groupPicture: string,
    messages: string[],
    createdAt?: Date,
    updatedAt?: Date,
    __v?: number
}
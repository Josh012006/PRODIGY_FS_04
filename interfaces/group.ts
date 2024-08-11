export default interface Group {
    _id?: string,
    name: string,
    description: string,
    members: string[],
    groupPicture: string,
    messages: string[],
    medias: string[],
}
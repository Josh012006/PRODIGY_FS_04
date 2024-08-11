export default interface Message {
    _id?: string,
    sender: string,
    receiver: string,
    type: string,
    content: string,
}
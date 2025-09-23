import { Message } from "./message"

export type Historial = {
    id:string,
    createdAt:string,
    messages:Message[],
    title:string
}
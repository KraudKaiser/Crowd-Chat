export type Message = {
    id:string,
    owner:"you" | "bot" | "bot-temp",
    message:string,
    url:string | null
    type: "text" | "image" | "image_with_text",
    timestamp:string
}
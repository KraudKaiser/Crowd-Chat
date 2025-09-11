import conversation from "@/Json/conversation.json"
let chats = [...conversation.chats]
export const useGetChats = () =>{
    return chats
}

export const useCreateChat = async(initialPrompt : string) =>{
    return new Promise((resolve) =>{
        setTimeout(()=>{
             const newChat = {
        id: chats.length + 1,
        title: initialPrompt,
        createdAt: Date.now().toString(),
        messages: [
          {
            id: 1,
            owner: "you",
            message: initialPrompt,
            timestamp: Date.now().toString(),
          },
        ],
      }
      chats.push(newChat)
      resolve(newChat)
        },500)
    })
    
   
}
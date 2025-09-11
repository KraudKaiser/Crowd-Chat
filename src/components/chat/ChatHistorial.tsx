

export default function ChatHistorial({chat} : {chat:{owner:string, message:string}[]}) {

    console.log("aqui: ", chat)
    return (
        <section className="h-full flex flex-1 justify-center items-center ">
            {chat && chat.length == 0 && (
                <h1 className="text-4xl font-mono text-white">¿Que quieres pedirme hoy?</h1>
            )}
            <div className="w-full h-full flex flex-col justify-center p-4 ">
                {
                    
                    chat.length != 0 && chat.messages.map((message) => (
                        <span key={message.message} className={`w-fit p-2 rounded-md  
                            ${message.owner == "bot" ? "place-self-start  rounded-bl-none"
                            : "place-self-end bg-gray-500 rounded-br-none"}`}>
                            <h1 className="font-mono font-semibold text-white">{message.message}</h1>
                        </span>
                    ))
                }
            </div>
        </section>
           
    )
}
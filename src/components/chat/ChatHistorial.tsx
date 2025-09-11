

export default function ChatHistorial({chat} : {chat:{owner:string, message:string}[]}) {
    return (
        <section className="flex items-center justify-center h-full ">
            {chat.length == 0 && (
                <h1 className="text-4xl font-mono text-white">¿Que quieres pedirme hoy?</h1>
            )}
            <div className="w-full h-full flex flex-col  p-4">
                {
                    
                    chat.length != 0 && chat.map((message) => (
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
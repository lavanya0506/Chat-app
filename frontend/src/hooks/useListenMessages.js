import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext"
import userConversation from "../zustand/useConversation"
import notification from "../assets/sounds/notification.mp3"

function useListenMessages() {
  const {socket} = useSocketContext()
  const {messages, setMessages} = userConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
        newMessage.shouldShake = true
        const sound = new Audio(notification)
        sound.play()
        setMessages([...messages, newMessage])
    })

    return () => socket?.off("newMessage")
  }, [socket, setMessages, messages])
}

export default useListenMessages

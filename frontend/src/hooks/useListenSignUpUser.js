import { useEffect } from "react";

const useListenUserSignup = (socket, setOnlineUsers) => {
    useEffect(() => {
        if(socket){
            socket.on("newUser", (newUser) => {
                setOnlineUsers((prevUsers) => [...prevUsers, newUser]);
            });

            return () => {
                socket.off("newUser");
            };
        }
    }, [socket, setOnlineUsers]);
};

export default useListenUserSignup;

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const navigate = useNavigate()
//create context-1
const ChatContext = createContext()

//create Provider-2
const ChatProvider = ({ children }) => {

    //create state - 5
    const [user, setUser] = useState()

    //7
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        //storing userinfo in setuser state -8
        setUser(userInfo)

        //9
        if (!userInfo) {
            navigate("/")
        }

    }, [navigate])


    //make state accessble for while app by passing it as a value props - 6
    return (
        <ChatContext.Provider value={{ user, setUser }}>
            {children}
        </ChatContext.Provider>
    )
}

//  Making stat accessble = use useContext Hook - 4
//hook will take the contect which we creatd using  createContext
export const ChatState = () => {
    useContext(ChatContext)
}


export default ChatProvider;
//wrap the whole app with the provider -3 in main.jsx
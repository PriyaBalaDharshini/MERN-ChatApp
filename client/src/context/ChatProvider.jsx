import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 1. Create a context to hold the state globally
const ChatContext = createContext();

// 2. Create the Provider component to wrap around your app and pass the context value
const ChatProvider = ({ children }) => {
    const navigate = useNavigate();

    // 5. Create state variables (user) that will be accessible throughout the app
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chat, setChat] = useState([]);
    const [notification, setNotification] = useState([]);

    // 7. Use the useEffect hook to run this when the component mounts
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        // 8. Storing the retrieved userInfo into state using setUser
        setUser(userInfo);

        // 9. If no user is found, redirect to the home page ("/")
        if (!userInfo) {
            navigate("/");
        }
    }, [navigate]);

    // 10. Use the useEffect hook to save notifications to localStorage when they change
    /* useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notification));
    }, [notification]); */

    // 6. Pass the state (user, setUser) down to the whole app via the context provider
    return (
        <ChatContext.Provider
            value={{
                user,
                setUser,
                selectedChat,
                setSelectedChat,
                chat,
                setChat,
                notification,
                setNotification
            }}>
            {children}
        </ChatContext.Provider>
    );
};

// 4. Create a custom hook to allow easy access to the context
export const ChatState = () => {
    // You need to return the value here, otherwise it won't work
    return useContext(ChatContext);
};

// 3. Export the Provider component, which will be used to wrap the entire app
export default ChatProvider;

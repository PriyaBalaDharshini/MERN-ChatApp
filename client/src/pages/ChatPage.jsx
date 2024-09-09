import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config'

const ChatPage = () => {
    const [chats, setChats] = useState([])

    const fetchChat = async () => {
        const response = await axios.get(`${API_BASE_URL}/chat`)
        setChats(response.data);
    }

    useEffect(() => {
        fetchChat()
    }, [])

    return (
        <div>
            {chats.map((chat, index) => (
                <div key={index}>{chat.chatName}</div>
            ))}
        </div>
    )
}

export default ChatPage
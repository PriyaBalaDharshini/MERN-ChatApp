import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from './ChatLoading'
import { getSender } from "../../config/ChatLogics"

const MyChats = () => {

    const { user, selectedChat, setSelectedChat, chat, setChat } = ChatState()
    const [loggedUser, setLoggedUser] = useState()

    const toast = useToast()

    const fetchChat = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            }

            const { data } = await axios.get(`${API_BASE_URL}/chat/fetch-chat`, config);
            console.log(data);
            setChat(data)

        } catch (error) {
            toast({
                title: "Error fetching chat",
                description: "Failed to load",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChat()
    }, [])

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir={'column'}
            alignItems={'center'}
            p={5}
            bg={'white'}
            borderRadius={'lg'}
            borderWidth={'1px'}
            w={{ base: "100%", md: "31%" }}
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "24px", md: "26px" }}
                display={'flex'}
                w={"100%"}
                justifyContent={'space-between'}
                alignItems={'center'}

            >
                My Chats
                <Button
                    display={'flex'}
                    fontSize={{ base: "16px", md: "8px", lg: '16px' }}
                    rightIcon={<AddIcon />}

                >
                    New Group Chat
                </Button>
            </Box>

            <Box
                display={'flex'}
                flexDir={'column'}
                p={3}
                bg={'#F8F8F8'}
                w={'100%'}
                h={'100%'}
                borderRadius={'lg'}
                overflow={'hidden'}
            >
                {chat ? (
                    <Stack overflowY={'scroll'}>
                        {chat.map((c) => (
                            <Box
                                onClick={() => setSelectedChat(c)}
                                cursor="pointer"
                                bg={selectedChat === c ? "#38B2AC" : "#E8E8E8"}
                                color={selectedChat === c ? "white" : "black"}
                                px={3}
                                py={2}
                                borderRadius="lg"
                                key={c._id}
                            >
                                <Text>
                                    {!c.isGroupChat ? (
                                        getSender(loggedUser, c.users)
                                    ) : c.chatName}
                                </Text>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    )
}

export default MyChats
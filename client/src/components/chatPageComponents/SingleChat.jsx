import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import UpdateGroupChatModel from './UpdateGroupChatModel'
import { getSender, getSenderFull } from '../../config/ChatLogics'
import ProfileModel from './ProfileModel'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import "../styles.css";
import ScrollableChat from './ScrollableChat'


const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const { user, selectedChat, setSelectedChat } = ChatState()

    const [message, setMessage] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState([]);

    const toast = useToast()

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            const config = {
                headers: {

                    Authorization: `Bearer ${user.accessToken}`
                }
            }
            setLoading(true)
            const { data } = await axios.get(`${API_BASE_URL}/message/${selectedChat._id}`, config)

            console.log(message);

            setMessage(data)
            setLoading(false)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the chat",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [selectedChat])

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.accessToken}`,
                    },
                };

                const { data } = await axios.post(
                    `${API_BASE_URL}/message/send-message`,
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );

                console.log("Response from server:", data); 
                setNewMessage(""); 
                setMessage([...message, data]); 
            } catch (error) {
                console.log("Error:", error.response.data); 
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };


    const typingHandler = (e) => {
        setNewMessage(e.target.value)
    }


    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w={'100%'}
                        display={'flex'}
                        justifyContent={{ base: "space-between" }}
                        alignItems={'center'}
                    >
                        <IconButton
                            display={{ base: 'flex', md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>{selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModel
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )}

                    </Text>
                    <Box
                        display={'flex'}
                        flexDir={'column'}
                        justifyContent={'flex-end'}
                        p={5}
                        bg={'#E8E8E8'}
                        w={'100%'}
                        h={'100%'}
                        borderRadius={'lg'}
                        overflow={'hidden'}
                    >
                        {loading ? (
                            <Spinner
                                size={'xl'}
                                w={20}
                                h={20}
                                alignSelf={'center'}
                                margin={'auto'}
                            />
                        ) : (
                            <div className='messages'>
                                <ScrollableChat message={message} />
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3} >
                            <Input
                                variant={'filled'}
                                placeholder='Enter a message'
                                bg={'#E0E0E0'}
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    h={'100%'}
                >
                    <Text fontSize={'3xl'} >
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat
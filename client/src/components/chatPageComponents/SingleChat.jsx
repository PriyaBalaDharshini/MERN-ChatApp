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
import io from "socket.io-client"
import Lottie from "react-lottie"
import animationData from "../../animation/typing.json"

const ENDPOINT = "http://localhost:8000"
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()

    const [message, setMessage] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState([]);
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    //const [fetchAgain, setFetchAgain] = useState(false)

    const toast = useToast()
    const defaultOption = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectratio: "xMidYmid slice"
        }
    }


    /* useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true))
        socket.on("typing", setIsTyping(true))
        socket.on("stop typing", setIsTyping(true))
    }) */
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

        return () => {
            socket.off("connected");
            socket.off("typing");
            socket.off("stop typing");
        };
    }, [user]);

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

            //console.log(message);

            setMessage(data)
            setLoading(false)

            socket.emit("join chat", selectedChat._id)
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
        selectedChatCompare = selectedChat
    }, [selectedChat])
    //console.log(notification, "-----");

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification])
                    setFetchAgain(!fetchAgain)
                }

            } else {
                setMessage([...message, newMessageReceived])
            }
        })
    })


    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id)
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

                //console.log("Response from server:", data);
                setNewMessage("");

                socket.emit("new message", data)
                setMessage([...message, data]);
            } catch (error) {
                //console.log("Error:", error.response.data);
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
        setNewMessage(e.target.value);
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;
        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
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
                            <>{selectedChat.chatName}
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
                            {isTyping ? <>
                                <Lottie
                                    options={defaultOption}
                                    width={80}
                                    height={45}

                                    style={{ marginBottom: 15, marginLeft: 0 }}
                                />
                            </> : ""}
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
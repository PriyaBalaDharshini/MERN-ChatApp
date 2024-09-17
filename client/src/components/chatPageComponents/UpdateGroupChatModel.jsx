import { Box, Button, FormControl, IconButton, Input, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../context/ChatProvider'
import UserBadgeItem from '../userAvatar/UserBadgeItem'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import UserListItem from '../userAvatar/UserListItem'

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { selectedChat, setSelectedChat, user } = ChatState()

    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)


    const toast = useToast();

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User Already in group!",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            };

            const { data } = await axios.put(`${API_BASE_URL}/chat/addto-group`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Something Went Wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    }

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            };
            const { data } = await axios.put(`${API_BASE_URL}/chat/removefrom-group`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages()
            setLoading(false);

        } catch (error) {
            console.log(error);
        }
    }


    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            };


            const { data } = await axios.put(`${API_BASE_URL}/chat/rename-group`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName
                },
                config)
            console.log(data);

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)

        } catch (error) {
            //console.log(error);
            toast({
                title: "Error Occured! lease Again",
                description: error?.response?.data?.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
            setRenameLoading(false)
        }

    }
    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) return;
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            };

            const { data } = await axios.get(`${API_BASE_URL}/user/find-user?search=${search} `, config);
            //console.log(data);
            setLoading(false)
            setSearchResult(data)

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false);
        }
    }

    return (
        <>
            <IconButton icon={<ViewIcon />} onClick={onOpen} display={{ base: "flex" }} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display={'flex'} w={'100%'} flexWrap={'wrap'} pb={3} >
                            {selectedChat.users.map(u => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleRemove(u)} />
                            ))}
                        </Box>

                        <FormControl display={'flex'} >
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />

                            <Button
                                variant={'solid'}
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add User to Group'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? (
                            <Spinner size={'lg'} />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFuntion={() => handleAddUser(user)}
                                />
                            ))
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme='red' >
                            Leave Group
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>

    )
}

export default UpdateGroupChatModel
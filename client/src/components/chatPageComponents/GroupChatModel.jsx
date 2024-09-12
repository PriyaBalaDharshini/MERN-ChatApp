import { Box, Button, FormControl, Input, useDisclosure, useToast } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import UserListItem from '../userAvatar/UserListItem'
import UserBadgeItem from '../userAvatar/UserBadgeItem'

const GroupChatModel = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState('')
    const [serachResults, setSerachResults] = useState([])
    const [loading, setLoading] = useState(false)

    const toast = useToast()
    const { user, chat, setChat } = ChatState()

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            }

            const { data } = await axios.get(`${API_BASE_URL}/user/find-user?search=${search} `, config);
            setLoading(false)
            setSerachResults(data)
            console.log(data);

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

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers.length) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                    'Content-Type': 'application/json'
                }
            };

            const { data } = await axios.post(`${API_BASE_URL}/chat/create-group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map(u => u._id))
                },
                config
            );

            setChat([data, ...chat]);
            onClose();

            toast({
                title: "New Group Created",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top"
            });

        } catch (error) {
            toast({
                title: "Something went wrong",

                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
            });
        }
    };

    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter(select => select._id !== userToDelete._id))
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers?.includes(userToAdd)) {
            toast({
                title: "User already exists",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd])
    }


    return (
        <>
            <span onClick={onOpen}  >{children} </span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        display={'flex'}
                        justifyContent={'center'}

                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={'flex'}
                        flexDir={'column'}
                        alignItems={'center'}
                    >
                        <FormControl>
                            <Input placeholder='Group Name' mb={5} onChange={(e) => setGroupChatName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add Users' mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>

                        <Box w={'100%'} display={'flex'} flexWrap={'wrap'} >
                            {selectedUsers?.map(u => (
                                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                            ))}
                        </Box>

                        {loading ? <div>Loading...</div> : (
                            serachResults?.map(user => (
                                <UserListItem key={user._id} user={user} handleFuntion={() => handleGroup(user)} />
                            ))
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' mr={3} onClick={handleSubmit}>
                            Create Chat
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModel
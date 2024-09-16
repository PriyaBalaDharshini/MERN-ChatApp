import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner } from '@chakra-ui/react'
import React, { useState } from 'react'
import { SearchIcon, BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../context/ChatProvider'
import ProfileModel from './ProfileModel'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../config'
import ChatLoading from './ChatLoading'
import UserListItem from '../userAvatar/UserListItem'
import { getSender } from '../../config/ChatLogics'
import { Badge } from '@chakra-ui/react'


const SideDrawer = () => {

    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)

    const { user, setSelectedChat, chat, setChat, notification, setNotification } = ChatState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const navigate = useNavigate()

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/")
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.accessToken}`
                }
            }

            const { data } = await axios.post(`${API_BASE_URL}/chat/access-chat`, { userId }, config);

            if (!chat?.find((c) => c._id === data._id)) setChat([data, ...chat])

            setLoadingChat(false)
            setSelectedChat(data)
            onClose();

        } catch (error) {
            toast({
                title: "Error fetching chat",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please enter something",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-left"
            })
        }
        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            }
            //console.log(user);
            const { data } = await axios.get(`${API_BASE_URL}/user/find-user?search=${search} `, config);
            console.log(data);

            setLoading(false)
            setSearchResult(data)
        }
        catch (error) {
            toast({
                title: "Please enter something",
                description: "Failed to load the search Results",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }

    return (
        <>
            <Box
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bg={'white'}
                w={'100%'}
                p={'7px 10px'}
            >
                <Tooltip
                    label='Search user to chat'
                    hasArrow
                    placement='bottom-end'
                >
                    <Button
                        variant='ghost'
                        onClick={onOpen}
                    >
                        <SearchIcon />
                        <Text display={{ base: "none", md: "flex" }} px={4}>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize={'xl'}>❤️ Chat-A-Ton ❤️</Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <Badge borderRadius='full' px={2} py={1} colorScheme='red'>{notification.length}</Badge>
                            <BellIcon fontSize={'2xl'} m={1} />
                        </MenuButton>
                        <MenuList p={3}
                        >
                            {!notification.length && "No New Messages"}
                            {notification?.map(n => (
                                <MenuItem key={n._id}
                                    onClick={() => {
                                        setSelectedChat(n.chat)
                                        setNotification(notification.filter((noti) => noti != n))
                                    }
                                    }

                                >
                                    {n.chat.isGroupChat ? `Notification from ${n.chat.chatName}` : `New Message  from ${getSender(user, n.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon fontSize={'xl'} />}>
                            <Avatar backgroundColor={"black"} size={'sm'} cursor={'pointer'} name={user.name} src={user.name.charAt(0).toUpperCase()} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModel>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box >

            <Drawer placement='left' onClose={onClose} isOpen={isOpen}  >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={'1px'} >Search User</DrawerHeader>
                    <DrawerBody>
                        <Box display={'flex'} pb={2} p={4} >
                            <Input placeholder='Search by name or email'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                mr={2}
                            />
                            <Button onClick={handleSearch}>
                                Go
                            </Button>
                        </Box>

                        {loading ? (<ChatLoading />) : (
                            <Box>
                                {searchResult?.map(user => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFuntion={() => accessChat(user._id)}
                                    />
                                ))}
                            </Box>
                        )}

                        {loadingChat && <Spinner ml="auto" d="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>

    )
}

export default SideDrawer
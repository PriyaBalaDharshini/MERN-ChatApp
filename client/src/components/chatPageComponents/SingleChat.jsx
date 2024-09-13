import React from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Box, IconButton, Text } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import UpdateGroupChatModel from './UpdateGroupChatModel'
import { getSender, getSenderFull } from '../../config/ChatLogics'
import ProfileModel from './ProfileModel'

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const { user, selectedChat, setSelectedChat } = ChatState()
    console.log(selectedChat)
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
                                {/* <UpdateGroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> */}
                            </>
                        )}

                    </Text>
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
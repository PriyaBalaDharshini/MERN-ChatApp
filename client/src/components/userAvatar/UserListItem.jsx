import React from 'react'

import { Avatar, Box, Text } from '@chakra-ui/react'

const UserListItem = ({ user, handleFuntion }) => {

    return (
        <Box
            onClick={handleFuntion}
            cursor={'pointer'}
            bg={'#E8E8E8'}
            _hover={{
                background: "#38B2AC",
                color: "white"
            }}
            w={'100%'}
            display={'flex'}
            alignItems={'center'}
            color={'black'}
            px={3}
            py={2}
            mb={2}
            borderRadius={'lg'}
        >
            <Avatar
                mr={2}
                size={'sm'}
                name={user.name} // This will now correctly display the search result user's name
                src={user.pic}
            />
            <Box>
                <Text>{user.name}</Text> {/* Display the search result user's name */}
                <Text fontSize='xs'>{user.email}</Text> {/* Display the search result user's email */}
            </Box>
        </Box>
    )
}

export default UserListItem

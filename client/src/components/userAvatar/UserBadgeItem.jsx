import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Box
            px={4}
            py={2}
            borderRadius={'lg'}
            m={1} mb={2}
            variant='solid'
            fontSize={'12'}
            backgroundColor="purple"
            cursor={'pointer'}
            onClick={handleFunction}
            color={'white'}
        >
            {user.name}
            <CloseIcon ml={2} />
        </Box>
    )
}

export default UserBadgeItem
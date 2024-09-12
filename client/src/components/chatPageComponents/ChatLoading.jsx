import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const ChatLoading = () => {
    return (
        <Stack p={2} mb={1}>
            <Skeleton height={'45px'} />
            <Skeleton height={'45px'} />
            <Skeleton height={'45px'} />
            <Skeleton height={'45px'} />
            <Skeleton height={'45px'} />
            <Skeleton height={'45px'} />
        </Stack>
    )
}

export default ChatLoading
import React, { useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/chatPageComponents/SideDrawer';
import MyChats from '../components/chatPageComponents/MyChats';
import ChatBox from '../components/chatPageComponents/ChatBox';

const ChatPage = () => {
    // 10. Fetch the user from the ChatState hook
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState()

    return (
        <div style={{ width: "100%" }}>

            {user && <SideDrawer />}
            <Box display={'flex'} justifyContent={'space-between'} p={'10px'} w={'100%'} h={'90vh'}>
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    );
};

export default ChatPage;

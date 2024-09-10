import { Box, Container, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import React from 'react'
import Login from '../components/authentication/Login'
import Signup from '../components/authentication/Signup'


const HomePage = () => {
    return (
        <Container maxW='xl' centerContent>
            <Box
                display='flex'
                justifyContent={'center'}
                alignItems='center'
                m='40px 0'
                p={5}
                bg={'white'}
                borderRadius={'lg'}
                borderWidth={'2px'}
                w={'100%'}
            >
                <Text fontSize={'xl'}>❤️ Chat-A-Ton ❤️</Text>
            </Box>
            <Box
                p={5}
                bg={'white'}
                borderRadius={'lg'}
                borderWidth={'2px'}
                w={'100%'}
            >
                <Tabs variant='soft-rounded'>
                    <TabList mb={'10px'}>
                        <Tab w={'50%'} p={4}>Login</Tab>
                        <Tab w={'50%'} p={4}>Signup</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>

                            <Login />

                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>

            </Box>
        </Container>
    )
}

export default HomePage
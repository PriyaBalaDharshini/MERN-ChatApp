import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../context/ChatProvider'

const ProfileModel = ({ user, children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()


    return (
        <>
            {children
                ?
                (<span onClick={onOpen}>{children}</span>)
                :
                (<IconButton
                    display={{ base: "flex" }}
                    icon={<ViewIcon />}
                    onClick={onOpen}
                />)}

            <Modal size={'lg'} isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent h={'310px'} >
                    <ModalHeader
                        display={'flex'}
                        justifyContent={'center'}
                        fontSize={'26px'}
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        flexDir={'column'}>
                        <Image
                            src={user.pic}
                            alt={user.name}
                            borderRadius={'50%'}
                            mb={"10px"}
                        />
                        <Text fontSize={"20px"} >Email: {user.email}</Text>
                    </ModalBody>

                    {/*  <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>

                    </ModalFooter> */}
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModel
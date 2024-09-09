import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

const Signup = () => {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [pic, setPic] = useState()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    const postDetails = (pic) => { }

    const sumbitHandler = () => { }

    return (
        <VStack spacing={'18px'}>
            <FormControl id='name' isRequired>
                <FormLabel>Name: </FormLabel>
                <Input
                    placeholder='Enter your name'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>

            <FormControl id='email' isRequired >
                <FormLabel>Email: </FormLabel>
                <Input
                    placeholder='Enter your email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Password: </FormLabel>
                <InputGroup>
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder='Enter your password'
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <InputRightElement width='4.5rem'>
                        <Button h='2rem' size={'sm'} onClick={handleShowPassword}>
                            {showPassword ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='confirm-password' isRequired>
                <FormLabel>Confirm Password: </FormLabel>
                <InputGroup>
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder='Confirm your password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <InputRightElement width='4.5rem'>
                        <Button h='2rem' size={'sm'} onClick={handleShowConfirmPassword}>
                            {showConfirmPassword ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>


            <FormControl id='pic' isRequired >
                <FormLabel>Upload Profile Pic: </FormLabel>
                <Input
                    type='file'
                    onChange={(e) => postDetails(e.target.files[0])}
                    p={1.5}
                    accept='image/*'
                />
            </FormControl>

            <Button
                p={6}
                borderRadius={'xl'}
                colorScheme={'blue'}
                w={"100%"}
                mt={4}
            >
                Signup
            </Button>

            <Button
                p={6}
                borderRadius={'xl'}
                colorScheme={'green'}
                w={"100%"}
                mt={3}
                onClick={sumbitHandler}
            >
                Login
            </Button>
        </VStack>
    )
}

export default Signup
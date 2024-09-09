import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

const Login = () => {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [showPassword, setShowPassword] = useState(false)

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const sumbitHandler = () => { }

    return (
        <VStack spacing={'18px'}>
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

            <Button
                p={6}
                borderRadius={'xl'}
                colorScheme={'green'}
                w={"90%"}
                mt={4}
                onClick={sumbitHandler}
            >
                Login
            </Button>

            <Button
                p={6}
                borderRadius={'xl'}
                colorScheme={'blue'}
                w={"90%"}
                mt={3}
            >
                Signup
            </Button>

            <Button
                p={6}
                borderRadius={'xl'}
                w={"90%"}
                mt={3}
                variant={'solid'}
                colorScheme='red'
                onClick={() => {
                    setEmail("guest@example.com")
                    setPassword("123456")
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    )
}

export default Login
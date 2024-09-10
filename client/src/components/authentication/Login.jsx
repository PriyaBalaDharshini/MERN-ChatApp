import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../config'

const Login = () => {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const toast = useToast()

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const sumbitHandler = async () => {
        setLoading(true)
        if (!email || !password) {
            toast({
                title: "Mandatory to Fill",
                description: "Please fill all the mandatory feilds to continue",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            };

            const { data } = await axios.post(
                `${API_BASE_URL}/user/login`,
                { email, password },
                config
            )
            console.log(data);
            toast({
                title: "Login Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data))
            setLoading(false);
            navigate("/chat")


        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response?.data?.message || "Something went wrong",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false)
        }
    }

    return (
        <VStack spacing={'18px'}>
            <FormControl id='email' isRequired >
                <FormLabel>Email: </FormLabel>
                <Input
                    placeholder='Enter your email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </FormControl>


            <FormControl id='password' isRequired>
                <FormLabel>Password: </FormLabel>
                <InputGroup>
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder='Enter your password'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
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
                w={"90%"}
                mt={3}
                variant={'solid'}
                colorScheme='red'
                onClick={() => {
                    setEmail("guest@example.com")
                    setPassword("123456")
                }}
                isLoading={loading}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    )
}

export default Login
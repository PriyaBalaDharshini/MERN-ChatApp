import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { API_BASE_URL } from '../../config'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [pic, setPic] = useState()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const toast = useToast()

    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const postDetails = (picture) => { }

    const sumbitHandler = async () => {
        setLoading(true)
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: "Mandatory to Fill",
                description: "Please fill all the mandatory feilds to continue",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: "Password and Confirm Password must be same",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        console.log(name, email, password, pic);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                `${API_BASE_URL}/user/register`,
                { name, email, password, pic },
                config
            )
            console.log(data);
            toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false)
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


            {/* <FormControl id='pic' isRequired >
                <FormLabel>Upload Profile Pic: </FormLabel>
                <Input
                    type='file'
                    onChange={(e) => postDetails(e.target.files[0])}
                    p={1.5}
                    accept='image/*'
                />
            </FormControl> */}

            <Button
                p={6}
                borderRadius={'xl'}
                colorScheme={'blue'}
                w={"100%"}
                mt={4}
                isLoading={loading}
                onClick={sumbitHandler}
            >
                Signup
            </Button>

        </VStack>
    )
}

export default Signup
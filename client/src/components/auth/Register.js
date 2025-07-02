'use client';
import {
  Flex, Box, FormControl, FormLabel, Input, Stack, Button,
  Heading, Text, Link, useToast
} from '@chakra-ui/react';
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_BASE } from '../../components/utils/api';
import Auth from '../../components/utils/auth';
import axios from "axios";

export default function SignupCard() {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [otpPhase, setOtpPhase] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (Auth.loggedIn()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetOtp = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/user/getOtp`, { email: formState.email }, { withCredentials: true });

      if (response.data.success) {
        setOtpPhase(true);
        toast({ title: 'OTP sent to your email', status: 'success', duration: 3000, isClosable: true });
      } else {
        throw new Error(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast({ title: 'Error', description: error.message, status: 'error', duration: 3000, isClosable: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpPhase) {
      await handleGetOtp();
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formState,
        verificationCode,
      };

      const response = await axios.post(`${API_BASE}/user/register`, payload, { withCredentials: true });

      if (response.data.success) {
        Auth.login(response.data.token);
        toast({ title: 'Account verified and logged in!', status: 'success', duration: 3000, isClosable: true });
        navigate('/dashboard');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast({ title: 'Verification failed', description: error.message, status: 'error', duration: 5000, isClosable: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH={'100vh'} minW={'70vw'} align={'center'} justify={'center'} bg="gray.50">
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign up</Heading>
          <Text fontSize={'lg'}>To start helping! ✌️</Text>
        </Stack>
        <Box rounded={'lg'} bg="white" boxShadow={'lg'} p={8}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input type="text" name="username" value={formState.username} onChange={handleChange} />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email" name="email" value={formState.email} onChange={handleChange} />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" name="password" value={formState.password} onChange={handleChange} />
              </FormControl>

              {otpPhase && (
                <FormControl id="verificationCode" isRequired>
                  <FormLabel>OTP</FormLabel>
                  <Input type="text" name="verificationCode" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                </FormControl>
              )}

              <Stack spacing={10} pt={2}>
                <Button
                  size="lg"
                  bg={'blue.400'}
                  color={'white'}
                  type="submit"
                  isLoading={isLoading}
                  loadingText={otpPhase ? 'Verifying OTP...' : 'Sending OTP...'}
                  _hover={{ bg: 'blue.500' }}
                >
                  {otpPhase ? 'Submit OTP & Sign Up' : 'Get OTP'}
                </Button>
              </Stack>

              <Stack pt={6}>
                <Text align={'center'}>
                  Already a user? <Link color={'blue.400'} as={ReactRouterLink} to='/'>Login</Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}

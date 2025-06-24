import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import {
  Button,
  Input,
  Box,
  Text,
  VStack,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import { CiLogin } from "react-icons/ci";
import { FiCopy } from "react-icons/fi";
import { IconButton, useToast, Flex } from "@chakra-ui/react";

export default function Login() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;
  const toast = useToast();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      status: "success",
      duration: 1500,
      isClosable: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setErr(err.message);
    }
  };

  return (
    <Box maxW="md" mx="auto" p={6}>
      {message && (
        <Text color="red.500" mb={4}>
          {message}
        </Text>
      )}
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Text fontSize="2xl" fontWeight="bold">
            Login
          </Text>
          {err && <Text color="red.500">{err}</Text>}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="filled"
            focusBorderColor="blue.500"
            fontSize="lg"
            py={5}
            borderRadius="md"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="filled"
            focusBorderColor="blue.500"
            fontSize="lg"
            py={5}
            borderRadius="md"
          />
          <Button
            bg={useColorModeValue("orange.300", "orange.400")}
            _hover={{ bg: "green.300" }}
            type="submit"
            leftIcon={<CiLogin size={20} />}
          >
            Login
          </Button>
        </VStack>
      </form>
      <Text mt={4} textAlign="center">
        Don&apos;t have an account?{" "}
        <RouterLink to="/register">
          <Text
            as="span"
            color="blue.600"
            textDecoration="underline"
            cursor="pointer"
          >
            Register here
          </Text>
        </RouterLink>
      </Text>

      <Card
        maxW="md"
        mx="auto"
        my={6}
        boxShadow="lg"
        borderRadius="xl"
        bg={useColorModeValue("orange.100", "orange.400")}
      >
        <CardHeader fontSize="xl" fontWeight="bold" textAlign="center">
          Test Login Credentials
        </CardHeader>
        <CardBody>
          <Box mb={2}>
            <Text>
              To test the functionality of this web application, please use the
              following credentials:
            </Text>
          </Box>
          <Box mt={2}>
            <Flex align="center" gap={2}>
              <Text fontWeight="semibold">Email:</Text>
              <Text>tester@knitnox.com</Text>
              <IconButton
                aria-label="Copy email"
                icon={<FiCopy />}
                size="sm"
                onClick={() => handleCopy("tester@knitnox.com")}
              />
            </Flex>
            <Flex align="center" gap={2} mt={2}>
              <Text fontWeight="semibold">Password:</Text>
              <Text>Tester123456</Text>
              <IconButton
                aria-label="Copy password"
                icon={<FiCopy />}
                size="sm"
                onClick={() => handleCopy("Tester123456")}
              />
            </Flex>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}

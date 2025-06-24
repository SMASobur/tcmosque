import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  VStack,
  Heading,
  Text,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { CiLogin } from "react-icons/ci";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(""); // new field for registration code
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log({ name, email, password, code });
      await register(name, email, password, code); // include code
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setErr(err.message);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={4}>
      <Heading size="lg" mb={4}>
        Register
      </Heading>

      {err && <Text color="red.500">{err}</Text>}
      {success && (
        <Text color="green.500">Registration successful! Redirecting...</Text>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            variant="filled"
            focusBorderColor="green.500"
            fontSize="lg"
            py={5}
            borderRadius="md"
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="filled"
            focusBorderColor="green.500"
            fontSize="lg"
            py={5}
            borderRadius="md"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="filled"
            focusBorderColor="green.500"
            fontSize="lg"
            py={5}
            borderRadius="md"
          />
          <Input
            type="text"
            placeholder="Registration Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            variant="filled"
            focusBorderColor="green.500"
            fontSize="lg"
            py={5}
            borderRadius="md"
          />
          <Button
            type="submit"
            color="white"
            bg={useColorModeValue("orange.400", "orange.500")}
            _hover={{ bg: useColorModeValue("green.400", "green.500") }}
            leftIcon={<CiLogin />}
          >
            Register
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

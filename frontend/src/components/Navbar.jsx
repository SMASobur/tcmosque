import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Text,
  useColorMode,
  useColorModeValue,
  Image,
  Link as ChakraLink,
  Tooltip,
  Link,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  Badge,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ColorModeToggle } from "./ColorModeToggle";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { CiLogout, CiLogin } from "react-icons/ci";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="sticky"
      bg={useColorModeValue("gray.300", "gray.700")}
      color={useColorModeValue("gray.700", "gray.200")}
      boxShadow="md"
    >
      <Container maxW="fit" px={4} py={4}>
        <Flex
          h={20}
          alignItems={"center"}
          justifyContent={{
            base: "center",
            sm: "space-between",
          }}
          flexDir={{
            base: "column",
            sm: "row",
          }}
          gap={{ base: 4, sm: 0 }}
        >
          <Box
            fontSize={{ base: "22", sm: "38" }}
            fontWeight={"bold"}
            textAlign={"center"}
            bgGradient={"linear(to-r, orange.400, yellow.400)"}
            bgClip={"text"}
          >
            <Flex direction="row" align="center">
              <ChakraLink
                as={RouterLink}
                to="/"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  boxSize={{ base: "50px", sm: "70px" }}
                  objectFit="cover"
                  src="/fav.png"
                  alt="Logo"
                  mx={2}
                />
                Baitun Noor
                {/* Admin/Superadmin badge */}
                {user?.role === "admin" && (
                  <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded">
                    ADMIN
                  </span>
                )}
                {user?.role === "superadmin" && (
                  <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                    SUPER
                  </span>
                )}
              </ChakraLink>
            </Flex>
          </Box>
          <Box
            position="sticky"
            top="0"
            zIndex="sticky"
            bg={useColorModeValue("gray.300", "gray.700")}
            py={2}
          >
            <HStack spacing={2} alignItems={"center"}>
              <RouterLink to="/finance">
                <Button>🕌 Masjid Finance</Button>
              </RouterLink>
              {/* <RouterLink to="/cards">
                <Button>🖼️ Gallery</Button>
              </RouterLink> */}

              <Box ml="auto">
                <ColorModeToggle />
              </Box>

              {/* Authenticated user menu */}
              {user ? (
                <Menu>
                  <MenuButton>
                    <Avatar name={user.name} size="sm" />
                  </MenuButton>

                  <MenuList>
                    <MenuItem as={RouterLink} to="/profile">
                      👨‍🔧 Profile
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/about">
                      👨‍💻 Developer
                    </MenuItem>
                    {(user.role === "admin" || user.role === "superadmin") && (
                      <MenuItem as={RouterLink} to="/admin">
                        🛠 Admin Panel
                      </MenuItem>
                    )}
                    <MenuItem onClick={toggleColorMode}>
                      <Flex align="center" gap={2}>
                        {colorMode === "light" ? <IoMoon /> : <LuSun />}
                        <Text>
                          {colorMode === "light" ? "Dark Mode" : "Light Mode"}
                        </Text>
                      </Flex>
                    </MenuItem>

                    <MenuItem onClick={handleLogout}> 🚪 Logout</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <RouterLink to="/login">
                  <Tooltip label="Login">
                    <Button>
                      <CiLogin /> Sign in
                    </Button>
                  </Tooltip>
                </RouterLink>
              )}
            </HStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;

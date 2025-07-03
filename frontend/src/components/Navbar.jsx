import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Text,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  Image,
  Link as ChakraLink,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  Badge,
  IconButton,
  Show,
  Hide,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { IoMoon, IoSunny } from "react-icons/io5";
import { CiLogout, CiLogin } from "react-icons/ci";
import { ColorModeToggle } from "./ColorModeToggle";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleLogout = () => {
    logout();
  };

  return (
    <Box
      position={isMobile ? "static" : "sticky"}
      top="0"
      zIndex="sticky"
      bg={useColorModeValue("gray.300", "gray.700")}
      color={useColorModeValue("gray.700", "gray.200")}
      boxShadow="md"
    >
      <Container maxW="container.xl" px={4} py={3}>
        <Flex alignItems="center" justifyContent="space-between" width="full">
          {/* Logo/Brand Section */}
          <Flex align="center">
            <ChakraLink
              as={RouterLink}
              to="/"
              display="flex"
              alignItems="center"
              _hover={{ textDecoration: "none" }}
            >
              <Image
                boxSize={{ base: "40px", md: "50px" }}
                objectFit="cover"
                src="/fav.png"
                alt="Logo"
                mr={2}
              />
              <Text
                fontSize={{ base: "xl", md: "3xl" }}
                fontWeight="bold"
                bgGradient="linear(to-r, orange.400, yellow.400)"
                bgClip="text"
              >
                Baitun Noor Jame Masjid
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
              </Text>
            </ChakraLink>
          </Flex>

          {/* Desktop Navigation */}
          <Show above="md">
            <HStack spacing={4}>
              <RouterLink to="/finance">
                <Button>🕌 Finance</Button>
              </RouterLink>
              <RouterLink to="/gallery">
                <Button>📸 Gallery</Button>
              </RouterLink>

              <Box ml="auto">
                <ColorModeToggle />
              </Box>
              {user ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="ghost"
                    leftIcon={<Avatar name={user.name} size="sm" />}
                    size="sm"
                  >
                    <Text isTruncated maxW="120px">
                      {user.name}
                    </Text>
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
                    <MenuItem onClick={handleLogout}>🚪 Logout</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Button
                  as={RouterLink}
                  to="/login"
                  leftIcon={<CiLogin />}
                  size="sm"
                >
                  Sign in
                </Button>
              )}
            </HStack>
          </Show>

          {/* Mobile Navigation - Only shows avatar/color toggle */}
          <Hide above="md">
            <HStack spacing={2}>
              <Box ml="auto">
                <ColorModeToggle />
              </Box>

              {user ? (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<Avatar name={user.name} size="sm" />}
                    variant="ghost"
                    size="sm"
                  />
                  <MenuList>
                    <MenuItem as={RouterLink} to="/finance">
                      🕌 Finance
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/gallery">
                      📸 Gallery
                    </MenuItem>
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
                    <MenuItem onClick={handleLogout}>🚪 Logout</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <IconButton
                  as={RouterLink}
                  to="/login"
                  icon={<CiLogin />}
                  aria-label="Sign in"
                  variant="ghost"
                  size="sm"
                />
              )}
            </HStack>
          </Hide>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;

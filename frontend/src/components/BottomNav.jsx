import {
  Box,
  Flex,
  IconButton,
  useColorModeValue,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiPieChart, FiMenu } from "react-icons/fi";
import { FaDonate } from "react-icons/fa";
import { GiExpense } from "react-icons/gi";

import { IoMoon, IoSunny } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
const BottomNav = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const iconColor = useColorModeValue("gray.600", "gray.200");
  const location = useLocation();
  const activeColor = useColorModeValue("blue.500", "blue.200");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const isActive = (path) => location.pathname === path;
  const handleLogout = () => {
    logout();
  };

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      bg={bgColor}
      p={2}
      boxShadow="lg"
      zIndex="sticky"
      borderTop="1px"
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <Flex justify="space-around" align="center">
        <Flex
          as={RouterLink}
          to="/"
          direction="column"
          align="center"
          p={1}
          color={isActive("/") ? activeColor : iconColor}
        >
          <IconButton
            as={RouterLink}
            to="/"
            aria-label="Home"
            icon={<FiHome />}
            variant="ghost"
            color={isActive("/") ? activeColor : iconColor}
            fontSize="20px"
          />
          <Text fontSize="xs" mt={1}>
            Home
          </Text>
        </Flex>
        <Flex
          as={RouterLink}
          to="/finance"
          direction="column"
          align="center"
          p={1}
          color={isActive("/finance") ? activeColor : iconColor}
        >
          <IconButton
            as={RouterLink}
            to="/finance"
            aria-label="Finance"
            icon={<FiPieChart />}
            variant="ghost"
            color={isActive("/finance") ? activeColor : iconColor}
            fontSize="20px"
          />{" "}
          <Text fontSize="xs" mt={1}>
            Finance
          </Text>
        </Flex>
        <Flex
          as={RouterLink}
          to="/donations"
          direction="column"
          align="center"
          p={1}
          color={isActive("/donations") ? activeColor : iconColor}
        >
          <IconButton
            as={RouterLink}
            to="/donations"
            aria-label="Donations"
            icon={<FaDonate />}
            variant="ghost"
            color={isActive("/donations") ? activeColor : iconColor}
            fontSize="20px"
          />
          <Text fontSize="xs" mt={1}>
            Donations
          </Text>
        </Flex>
        <Flex
          as={RouterLink}
          to="/expenses"
          direction="column"
          align="center"
          p={1}
          color={isActive("/expenses") ? activeColor : iconColor}
        >
          <IconButton
            as={RouterLink}
            to="/expenses"
            aria-label="Expenses"
            icon={<GiExpense />}
            variant="ghost"
            color={isActive("/expenses") ? activeColor : iconColor}
            fontSize="20px"
          />
          <Text fontSize="xs" mt={1}>
            Expenses
          </Text>
        </Flex>
        <Flex direction="column" align="center" p={1}>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Menu"
              icon={<FiMenu />}
              variant="ghost"
              color={iconColor}
              fontSize="20px"
            />
            <Text fontSize="xs" mt={1}>
              More
            </Text>
            <MenuList mb={2} placement="top">
              {user ? (
                <>
                  <Text alignItems="end" align="end" isTruncated maxW="120px">
                    {user.name}
                  </Text>
                  <MenuItem
                    icon={colorMode === "light" ? <IoMoon /> : <IoSunny />}
                    onClick={toggleColorMode}
                    closeOnSelect={false}
                  >
                    {colorMode === "light" ? "Dark Mode" : "Light Mode"}
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
                </>
              ) : (
                <>
                  <MenuItem
                    icon={colorMode === "light" ? <IoMoon /> : <IoSunny />}
                    onClick={toggleColorMode}
                    closeOnSelect={false}
                  >
                    {colorMode === "light" ? "Dark Mode" : "Light Mode"}
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/gallery">
                    📸 Gallery
                  </MenuItem>
                  <MenuItem as={RouterLink} to="/login">
                    🚪 Login
                  </MenuItem>
                </>
              )}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};

export default BottomNav;

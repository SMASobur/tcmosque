import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
  Avatar,
  VStack,
  Divider,
  Text,
  Flex,
  Spinner,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { EditIcon, CheckIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  // State management
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    joinedAt: "",
  });
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirmDelete: "",
  });
  const [editStates, setEditStates] = useState({
    name: false,
    password: false,
  });
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Hooks
  const toast = useToast();
  const navigate = useNavigate();
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const editButtonBg = useColorModeValue("gray.200", "gray.600");
  const saveButtonBg = useColorModeValue("green.200", "green.600");

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfile({
          name: data.name,
          email: data.email,
          role: data.role || "user",
          joinedAt: data.createdAt || new Date().toISOString(),
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch profile",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  // Update profile name
  const updateName = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: profile.name }),
      });
      const data = await res.json();

      toast({
        title: data.message,
        status: res.ok ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });

      if (res.ok) {
        setEditStates({ ...editStates, name: false });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update name",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Change password
  const changePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/me/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });
      const data = await res.json();

      toast({
        title: data.message,
        status: res.ok ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });

      if (res.ok) {
        setEditStates({ ...editStates, password: false });
        setPasswords({ current: "", new: "", confirmDelete: "" });
        navigate("/login");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteAccount = async () => {
    if (!passwords.confirmDelete) {
      toast({
        title: "Error",
        description: "Please enter your password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/me", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: passwords.confirmDelete }),
      });

      if (res.ok) {
        // Clear all user data from client-side
        localStorage.removeItem("token");

        // Show success message
        toast({
          title: "Account deleted successfully",
          description: "You have been logged out",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Force a hard redirect to ensure complete logout
        window.location.href = "/login";
        return;
      }

      // Handle error responses
      const data = await res.json();
      throw new Error(data.message || "Failed to delete account");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message.includes("Failed to fetch")
          ? "Network error - please try again"
          : error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };
  if (loading) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <Box
      maxW="xl"
      mx="auto"
      mt={10}
      p={6}
      shadow="md"
      borderRadius="md"
      bg={bgColor}
    >
      {/* Profile Header */}
      <Flex direction="column" align="center" mb={6}>
        <Avatar name={profile.name} size="xl" mb={2} />
        <Heading size="md">{profile.name}</Heading>
        <Text color="gray.600">
          {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} |
          Joined on {new Date(profile.joinedAt).toLocaleDateString()}
        </Text>
      </Flex>

      {/* Profile Form */}
      <VStack spacing={5} align="stretch">
        {/* Email Field */}
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input value={profile.email} isReadOnly />
        </FormControl>

        {/* Name Field */}
        <FormControl>
          <Flex justify="space-between" align="center">
            <FormLabel fontWeight="bold" mb={0}>
              Name
            </FormLabel>
            <IconButton
              size="sm"
              icon={editStates.name ? <CheckIcon /> : <EditIcon />}
              onClick={() => {
                if (editStates.name) {
                  updateName();
                } else {
                  setEditStates({ ...editStates, name: true });
                }
              }}
              aria-label="Edit Name"
              bg={editStates.name ? saveButtonBg : editButtonBg}
              _hover={{
                bg: editStates.name ? "green.300" : "gray.300",
              }}
            />
          </Flex>
          <Input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            isReadOnly={!editStates.name}
            mt={2}
          />
        </FormControl>

        <Divider />

        {/* Password Change Section */}
        <Box>
          <Flex justify="space-between" align="center" mb={2}>
            <Heading size="sm">Change Password</Heading>
            <IconButton
              size="sm"
              icon={editStates.password ? <CheckIcon /> : <EditIcon />}
              onClick={() => {
                if (editStates.password) {
                  changePassword();
                } else {
                  setEditStates({ ...editStates, password: true });
                }
              }}
              aria-label="Edit Password"
              bg={editStates.password ? saveButtonBg : editButtonBg}
              _hover={{
                bg: editStates.password ? "green.300" : "gray.300",
              }}
            />
          </Flex>

          {editStates.password && (
            <>
              <FormControl mb={3}>
                <FormLabel>Current Password</FormLabel>
                <Input
                  type="password"
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                  placeholder="Enter current password"
                />
              </FormControl>

              <FormControl>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                  placeholder="Enter new password"
                />
              </FormControl>
            </>
          )}
        </Box>
      </VStack>

      <Divider my={6} />

      {/* Danger Zone */}
      <Box mt={4}>
        <Heading size="sm" color="red.500" mb={2}>
          Danger Zone
        </Heading>

        <Button
          variant="outline"
          colorScheme="red"
          size="sm"
          onClick={() => {
            setShowDelete(!showDelete);
            setPasswords({ ...passwords, confirmDelete: "" });
          }}
        >
          {showDelete ? "Cancel" : "Delete My Account"}
        </Button>

        {showDelete && (
          <Box
            mt={4}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            borderColor="red.300"
          >
            <Text color="red.600" mb={3}>
              Are you sure? This action is irreversible.
            </Text>
            <FormControl mb={3}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                value={passwords.confirmDelete}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirmDelete: e.target.value })
                }
                placeholder="Enter your password"
              />
            </FormControl>
            <Button
              colorScheme="red"
              onClick={deleteAccount}
              isLoading={isDeleting}
              loadingText="Deleting..."
            >
              Yes, Delete My Account
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProfilePage;

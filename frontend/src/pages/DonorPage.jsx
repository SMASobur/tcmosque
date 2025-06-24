import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Stack,
  Card,
  CardBody,
  useColorModeValue,
  Spinner,
  Button,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Flex,
  Input,
  FormControl,
  FormLabel,
  SimpleGrid,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import { useSchoolStore } from "../store/school";
import { useAuth } from "../context/AuthContext";

const DonorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const cancelRef = useRef();

  const { donors, donations, fetchAllSchoolData, deleteDonor, deleteDonation } =
    useSchoolStore();
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDonorDelete, setIsDonorDelete] = useState(false);
  const [confirmationName, setConfirmationName] = useState("");
  const [confirmationError, setConfirmationError] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const donor = donors.find((d) => d.id === id);
  const donorDonations = donations.filter((d) => d.donorId === id);

  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");

  useEffect(() => {
    if (!donors.length || !donations.length) {
      setLoading(true);
      fetchAllSchoolData().finally(() => setLoading(false));
    }
  }, [donors.length, donations.length, fetchAllSchoolData]);

  const showToast = (title, description, status = "info") => {
    toast({
      title,
      description,
      status,
      duration: 4000,
      isClosable: true,
    });
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    if (isDonorDelete && confirmationName !== donor?.name) {
      setConfirmationError("The name doesn't match the donor's name");
      return;
    }

    const result = isDonorDelete
      ? await deleteDonor(itemToDelete, token)
      : await deleteDonation(itemToDelete, token);

    onClose();
    setConfirmationName("");
    setConfirmationError("");

    if (result.success) {
      showToast(
        isDonorDelete ? "Donor deleted" : "Donation deleted",
        undefined,
        "success"
      );
      if (isDonorDelete) navigate("/donations");
    } else {
      showToast("Error deleting", result.message, "error");
    }
  };

  const openDeleteDialog = (deleteId, isDonor = false) => {
    setItemToDelete(deleteId);
    setIsDonorDelete(isDonor);
    setConfirmationName("");
    setConfirmationError("");
    onOpen();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading || !donors.length) {
    return (
      <Box p={6}>
        <Spinner />
        <Text>Loading donor data...</Text>
      </Box>
    );
  }

  if (!donor) {
    return (
      <Box p={6}>
        <Text>Donor not found.</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        textAlign="center"
      >
        <Heading mb={4} color={useColorModeValue("orange.400", "orange.300")}>
          {donor.name}
        </Heading>
        {(user?.role === "admin" || user?.role === "superadmin") && (
          <Box mb={4} textAlign="right">
            <Button
              colorScheme="red"
              onClick={() => openDeleteDialog(donor.id, true)}
              leftIcon={<DeleteIcon />}
            >
              Delete Donor
            </Button>
          </Box>
        )}
      </Flex>
      <Text mb={2} fontSize="lg" color={textColor} textAlign="center">
        Total Donations: ৳
        {donorDonations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
      </Text>
      <Text mb={6} fontSize="lg" color={textColor} textAlign="center">
        Number of Donations: {donorDonations.length}
      </Text>

      {donorDonations.length === 0 ? (
        <Card bg={cardBg}>
          <CardBody textAlign="center">
            <Text fontSize="lg">No donations recorded yet</Text>
          </CardBody>
        </Card>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          {" "}
          {/* 1 column on mobile, 2 on desktop */}
          {donorDonations.map((donation) => (
            <Card key={donation.id} bg={cardBg}>
              <CardBody>
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
                  <Text fontSize="md" fontWeight="bold" color={textColor}>
                    Amount: ৳{donation.amount.toLocaleString()}
                  </Text>
                  {isAdmin && (
                    <Button
                      mt={2}
                      colorScheme="red"
                      size="sm"
                      leftIcon={<DeleteIcon />}
                      onClick={() => openDeleteDialog(donation.id)}
                    >
                      Delete
                    </Button>
                  )}
                </Flex>

                <Text fontSize="sm" color={textColor}>
                  Date: {formatDate(donation.date)}
                </Text>
                <Text fontSize="sm" color={textColor}>
                  Medium: {donation.medium || "N/A"}
                </Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete {isDonorDelete ? "Donor" : "Donation"}
            </AlertDialogHeader>

            <AlertDialogBody>
              {isDonorDelete ? (
                <>
                  <Text mb={4}>
                    Are you sure you want to delete this donor and all their
                    donations? This action cannot be undone.
                  </Text>
                  <FormControl>
                    <FormLabel>
                      Type the donor's name "{donor?.name}" to confirm:
                    </FormLabel>
                    <Input
                      value={confirmationName}
                      onChange={(e) => setConfirmationName(e.target.value)}
                      placeholder={`Type "${donor.name}" to confirm`}
                    />
                    {confirmationError && (
                      <Text color="red.500" mt={2}>
                        {confirmationError}
                      </Text>
                    )}
                  </FormControl>
                </>
              ) : (
                "Are you sure you want to delete this donation? This action cannot be undone."
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isDisabled={isDonorDelete && confirmationName !== donor?.name}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default DonorPage;

import React, { useState, useEffect } from "react";
import { useSchoolStore } from "../store/school";
import { FaDonate } from "react-icons/fa";
import { FcDonate } from "react-icons/fc";
import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  SimpleGrid,
  useBreakpointValue,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Card,
  CardBody,
  Flex,
  useToast,
  Icon,
  Link,
  Input,
} from "@chakra-ui/react";
import { AddDonorModal } from "../components/modals/school/AddDonorModal";
import { AddDonationModal } from "../components/modals/school/AddDonationModal";
import { useAuth } from "../context/AuthContext";

const DonationPage = () => {
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.500");
  const cardBg = useColorModeValue("white", "gray.600");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.200", "gray.500");
  const linkColor = useColorModeValue("teal.600", "teal.300");
  const linkHoverColor = useColorModeValue("teal.800", "teal.200");

  const { donors, donations, fetchAllSchoolData, createDonor, createDonation } =
    useSchoolStore();

  const toast = useToast();
  const { user, token } = useAuth();
  const [newDonorName, setNewDonorName] = useState("");
  const [selectedDonorId, setSelectedDonorId] = useState("");
  const [DonorMedium, setDonorMedium] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [donationDate, setDonationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [donationSearch, setDonationSearch] = useState("");

  const {
    isOpen: isDonorModalOpen,
    onOpen: onDonorModalOpen,
    onClose: onDonorModalClose,
  } = useDisclosure();
  const {
    isOpen: isDonationModalOpen,
    onOpen: onDonationModalOpen,
    onClose: onDonationModalClose,
  } = useDisclosure();

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    fetchAllSchoolData();
  }, []);

  const addNewDonor = async () => {
    const trimmedName = newDonorName.trim();
    if (!trimmedName) return;

    const isDuplicate = donors.some(
      (donor) => donor.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      toast({
        title: "Duplicate Donor",
        description: "A donor with this name already exists.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const result = await createDonor(trimmedName, token);
    if (result.success) {
      toast({
        title: "Donor added.",
        description: `${trimmedName} has been added successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setSelectedDonorId(result.data.id);
      setNewDonorName("");
      onDonorModalClose();
    } else {
      alert(result.message || "Failed to create donor.");
    }
  };

  const addDonation = async () => {
    if (!selectedDonorId || !donationAmount) return;

    try {
      const result = await createDonation(
        {
          donorId: selectedDonorId,
          amount: parseFloat(donationAmount),
          medium: DonorMedium,
          date: donationDate,
          createdBy: {
            id: user?._id,
            name: user?.name,
          },
        },
        token
      );

      if (result.success) {
        toast({
          title: "Donation added.",
          description: "Donation recorded successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setDonationAmount("");
        setDonorMedium("");
        setDonationDate(new Date().toISOString().split("T")[0]);
        onDonationModalClose();
        await fetchAllSchoolData();
      } else {
        alert(result.message || "Failed to add donation.");
      }
    } catch (error) {
      console.error("Donation error:", error);
      alert("An unexpected error occurred");
    }
  };

  const openDonationModal = () => {
    setSelectedDonorId("");
    onDonationModalOpen();
  };

  const donorOptions = donors.map((donor) => ({
    value: donor.id,
    label: donor.name,
  }));

  const getDonationsByDonor = () => {
    const filteredDonors = donors.filter((donor) =>
      donor.name.toLowerCase().includes(donationSearch.toLowerCase())
    );

    return filteredDonors.map((donor) => {
      const donorDonations = donations.filter((d) => d.donorId === donor.id);
      const total = donorDonations.reduce((sum, d) => sum + d.amount, 0);
      return { donor, donations: donorDonations, total };
    });
  };

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <Box p={isMobile ? 3 : 5} bg={bgColor} minH="80vh">
      <Heading
        textAlign="center"
        color={useColorModeValue("teal.600", "teal.300")}
        mb={6}
        size={isMobile ? "lg" : "xl"}
      >
        Donation Management
      </Heading>

      {/* Summary Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} mb={6}>
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody textAlign="center">
            <FaDonate
              size="2em"
              color={useColorModeValue("#48BB78", "#68D391")}
            />
            <Text fontSize="sm" color={textColor} mt={2}>
              Total Donations
            </Text>
            <Heading
              size="md"
              color={useColorModeValue("green.500", "green.300")}
            >
              ৳{totalDonations.toLocaleString()}
            </Heading>
            <Text
              fontSize="xs"
              color={useColorModeValue("gray.500", "gray.400")}
            >
              {donations.length} transactions
            </Text>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody textAlign="center">
            <Icon as={FcDonate} w="2em" h="2em" />
            <Text fontSize="sm" color={textColor} mt={2}>
              Total Donors
            </Text>
            <Heading size="md" color="teal.500">
              {donors.length}
            </Heading>
            <Text
              fontSize="xs"
              color={useColorModeValue("gray.500", "gray.400")}
            >
              Active contributors
            </Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Donations Table */}
      <Box p="4" bg={cardBg} borderRadius="md" boxShadow="md">
        {(user?.role === "admin" || user?.role === "superadmin") && (
          <Flex justifyContent="center" gap={4} mb={8}>
            <Button
              colorScheme="blue"
              onClick={openDonationModal}
              rightIcon={<span>Add Donation</span>}
            >
              <FaDonate />
            </Button>

            <Button
              variant="outline"
              colorScheme="orange"
              onClick={onDonorModalOpen}
              rightIcon={<span>Add Donor</span>}
            >
              <FcDonate />
            </Button>
          </Flex>
        )}
        <Heading size="md" mb={4} color={textColor}>
          Donations by Donor
        </Heading>
        <Box mb={4}>
          <Input
            placeholder="Search Donors"
            value={donationSearch}
            onChange={(e) => setDonationSearch(e.target.value)}
          />
        </Box>

        <Box overflowX="auto">
          <Table
            size="sm"
            variant="striped"
            colorScheme={colorMode === "light" ? "green" : "gray"}
          >
            <Thead>
              <Tr>
                <Th color={textColor}>Donor</Th>
                <Th isNumeric color={textColor}>
                  Total
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {getDonationsByDonor().map(({ donor, total, donations }) => (
                <Tr key={donor.id}>
                  <Td color={textColor}>
                    <Link
                      href={`/donors/${donor.id}`}
                      color={linkColor}
                      fontWeight="medium"
                      textDecoration="underline"
                      _hover={{
                        color: linkHoverColor,
                        textDecoration: "underline",
                      }}
                    >
                      {donor.name}
                    </Link>
                  </Td>
                  <Td isNumeric color={textColor}>
                    ৳{total.toLocaleString()}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Text mt="2" textAlign="right" fontWeight="bold" color={textColor}>
          Total Donations: ৳{totalDonations.toLocaleString()}
        </Text>
      </Box>

      {/* Modals */}
      <AddDonorModal
        isOpen={isDonorModalOpen}
        onClose={onDonorModalClose}
        newDonorName={newDonorName}
        setNewDonorName={setNewDonorName}
        addNewDonor={addNewDonor}
      />

      <AddDonationModal
        isOpen={isDonationModalOpen}
        onClose={onDonationModalClose}
        donorOptions={donorOptions}
        selectedDonorId={selectedDonorId}
        setSelectedDonorId={setSelectedDonorId}
        donationAmount={donationAmount}
        setDonationAmount={setDonationAmount}
        DonorMedium={DonorMedium}
        setDonorMedium={setDonorMedium}
        donationDate={donationDate}
        setDonationDate={setDonationDate}
        addDonation={addDonation}
      />
    </Box>
  );
};

export default DonationPage;

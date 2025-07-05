import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);

import PrayerTimes from "../components/PrayerTimes";

import { useSchoolStore } from "../store/school";
import { FaDonate } from "react-icons/fa";
import { GiExpense } from "react-icons/gi";
import { FcGallery } from "react-icons/fc";
import { MdAccountBalance } from "react-icons/md";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
  Card,
  CardBody,
  Icon,
  Link,
  Image,
  Stack,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

const SchoolPage = () => {
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.500");
  const cardBg = useColorModeValue("white", "gray.600");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.200", "gray.500");

  const { donors, donations, expenses, expenseCategories, fetchAllSchoolData } =
    useSchoolStore();

  const { user } = useAuth();
  const [donationSearch, setDonationSearch] = useState("");
  const [expenseSearch, setExpenseSearch] = useState("");

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    fetchAllSchoolData();
  }, []);

  // Calculate totals
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalDonations - totalExpenses;

  // Get top donors
  const getDonationsByDonor = () => {
    const filteredDonors = donors.filter((donor) =>
      donor.name.toLowerCase().includes(donationSearch.toLowerCase())
    );

    return filteredDonors.map((donor) => {
      const donorDonations = donations.filter((d) => d.donorId === donor.id);
      const total = donorDonations.reduce((sum, d) => sum + d.amount, 0);
      return { donor, total };
    });
  };

  const topDonors = getDonationsByDonor()
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Get expense categories
  const getExpensesByCategory = () => {
    const filteredCategories = expenseCategories.filter((category) =>
      category.name.toLowerCase().includes(expenseSearch.toLowerCase())
    );

    return filteredCategories.map((category) => {
      const categoryExpenses = expenses.filter(
        (e) => e.category?._id === category._id || e.category === category._id
      );
      const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
      return { category, total };
    });
  };

  const mostExpenses = getExpensesByCategory()
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <Box p={isMobile ? 3 : 5} bg={bgColor} minH="80vh">
      <Box
        borderRadius="lg"
        overflow="hidden"
        borderWidth="1px"
        borderColor={useColorModeValue("gray.200", "gray.600")}
        display="flex"
        flexDirection={isMobile ? "column" : "row"} // Stack vertically on mobile
        alignItems="center"
        justifyContent="center"
        textAlign={isMobile ? "center" : "left"} // Center text on mobile
        gap={isMobile ? 4 : 8} // Adjust gap for mobile
        p={isMobile ? 4 : 6} // Responsive padding
        mb={4}
      >
        <Box
          position="relative" // Needed for absolute positioning of child
          width="100%"
          display={{ base: "block", md: "none" }}
        >
          <Text
            fontSize={isMobile ? "2xl" : "4xl"}
            color={useColorModeValue("orange.600", "orange.300")}
            fontStyle="italic"
            fontWeight="semibold"
            borderColor={useColorModeValue("orange.300", "orange.500")}
            px={2}
            pb={1}
            display="inline-block"
            position={{ base: "absolute", md: "static" }}
            top={{ base: 0, md: "auto" }}
            right={{ base: 0, md: "auto" }}
            textAlign={{ base: "right", md: "left" }}
            mt={{ base: 2, md: 0 }}
            filter="drop-shadow(0 4px 10px rgba(0, 0, 0, 0.45))"
          >
            স্থাপিত: ১৯৮৬
          </Text>
        </Box>
        {/* Mosque Image (centered on mobile) */}
        <Image
          src="fav.png"
          alt="Mosque Construction Progress"
          objectFit="cover"
          width={isMobile ? "200px" : "300px"} // Smaller on mobile
          height={isMobile ? "200px" : "300px"}
          borderRadius="md"
          boxShadow="sm"
          filter="drop-shadow(0 15px 15px rgba(0, 0, 0, 0.45))"
        />

        {/* Mosque Details (stacked vertically) */}
        <Stack
          spacing={isMobile ? 2 : 3}
          filter="drop-shadow(0 4px 10px rgba(0, 0, 0, 0.45))"
        >
          <Heading
            as="b"
            fontSize={isMobile ? "3xl" : "5xl"} // Smaller on mobile
            color={useColorModeValue("orange.500", "orange.300")}
            lineHeight="shorter"
          >
            বাইতুন নূর জামে মসজিদ
          </Heading>

          <Text
            fontSize={isMobile ? "xl" : "3xl"} // Responsive font size
            color={useColorModeValue("gray.700", "gray.200")}
          >
            তিলকচাঁন পুর।
          </Text>

          <Text
            fontSize={isMobile ? "lg" : "2xl"}
            color={useColorModeValue("gray.600", "gray.300")}
          >
            বালাগঞ্জ-৩১২০, সিলেট।
          </Text>

          <Text
            fontSize={isMobile ? "2xl" : "3xl"}
            color={useColorModeValue("orange.600", "orange.300")}
            fontStyle="italic"
            fontWeight="semibold"
            borderBottom="2px solid"
            borderColor={useColorModeValue("orange.300", "orange.500")}
            px={2}
            pb={1}
            display={{ base: "none", md: "block" }}
          >
            স্থাপিত: ১৯৮৬
          </Text>
        </Stack>
      </Box>
      <Box mb={4}>
        <PrayerTimes />
      </Box>

      {/* Summary Cards */}
      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4} mb={6}>
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
              ৳ {totalDonations.toLocaleString()}
            </Heading>
            <Text
              fontSize="xs"
              color={useColorModeValue("gray.500", "gray.400")}
            >
              {donations.length} transactions
            </Text>
            <Link as={RouterLink} to="/donations" mt={2} display="block">
              <Button mt={4} colorScheme="orange" size="sm" variant="outline">
                View Details
              </Button>
            </Link>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody textAlign="center">
            <GiExpense
              size="2em"
              color={useColorModeValue("#E53E3E", "#FC8181")}
            />
            <Text fontSize="sm" color={textColor} mt={2}>
              Total Expenses
            </Text>
            <Heading size="md" color={useColorModeValue("red.500", "red.300")}>
              ৳ {totalExpenses.toLocaleString()}
            </Heading>
            <Text
              fontSize="xs"
              color={useColorModeValue("gray.500", "gray.400")}
            >
              {expenses.length} transactions
            </Text>
            <Link as={RouterLink} to="/expenses" mt={2} display="block">
              <Button mt={4} colorScheme="orange" size="sm" variant="outline">
                View Details
              </Button>
            </Link>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody textAlign="center">
            <Icon
              as={MdAccountBalance}
              w="2em"
              h="2em"
              color={balance >= 0 ? "teal.600" : "red.600"}
              _dark={{ color: balance >= 0 ? "teal.300" : "red.300" }}
            />
            <Text fontSize="sm" color={textColor} mt={2}>
              Current Balance
            </Text>
            <Heading
              size="md"
              color={
                balance >= 0
                  ? useColorModeValue("teal.600", "teal.300")
                  : useColorModeValue("red.600", "red.300")
              }
            >
              ৳ {balance.toLocaleString()}
            </Heading>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Financial Charts */}
      <Card bg={cardBg} p={2} mb={6}>
        <Flex
          direction={{ base: "column", md: "row" }}
          w="100%"
          h="100%"
          gap={0}
          align="stretch"
        >
          {/* most  5 recent Donors */}
          <Box flex={1} p={1}>
            <Heading
              size="sm"
              mb={4}
              textAlign="center"
              color={useColorModeValue("gray.800", "whiteAlpha.900")}
            >
              Most recent Donors
            </Heading>
            <Box
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              borderColor={borderColor}
            >
              <Table variant="simple" size="sm">
                <Thead bg={useColorModeValue("gray.100", "gray.700")}>
                  <Tr>
                    <Th color={textColor}>Donor</Th>
                    <Th color={textColor} isNumeric>
                      Amount
                    </Th>
                    <Th color={textColor}>Date</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {donations
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 7)
                    .map((donation, index) => {
                      const donor = donors.find(
                        (d) => d.id === donation.donorId
                      );
                      return (
                        <Tr
                          key={donation.id}
                          bg={
                            index % 2 === 0
                              ? useColorModeValue("gray.50", "gray.00")
                              : "transparent"
                          }
                          _hover={{
                            bg: useColorModeValue("gray.100", "gray.700"),
                          }}
                        >
                          <Td color={textColor}>{donor?.name || "Unknown"}</Td>
                          <Td color={textColor} isNumeric>
                            <Box as="span" fontWeight="medium">
                              ৳ {donation.amount.toLocaleString()}
                            </Box>
                          </Td>
                          <Td color={textColor}>
                            <Box
                              as="span"
                              fontSize="sm"
                              color={useColorModeValue("gray.600", "gray.400")}
                            >
                              {new Date(donation.date).toLocaleDateString()}
                            </Box>
                          </Td>
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </Box>
          </Box>

          {/* Finance Summary Image */}
          <Box
            flex={1}
            p={4}
            borderLeft={{ base: "none", md: "1px solid" }}
            borderTop={{ base: "1px solid", md: "none" }}
            borderColor={useColorModeValue("gray.200", "gray.600")}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <Heading
              size="sm"
              mb={4}
              color={useColorModeValue("gray.800", "whiteAlpha.900")}
            >
              Finance
            </Heading>
            <Image
              src="fav1.png"
              alt="Mosque Construction Progress"
              objectFit="cover"
              width="200px"
              height="200px"
              mb={4}
            />
            <Text mb={2}>View a summary of all financial transactions.</Text>
            <Link
              as={RouterLink}
              to="/finance"
              color={useColorModeValue("teal.500", "teal.300")}
              fontWeight="medium"
            >
              <Button mt={4} colorScheme="orange" size="sm" variant="outline">
                View Finance Overview
              </Button>
            </Link>
          </Box>
        </Flex>
      </Card>
      {/* <Card
        bg={cardBg}
        border="1px"
        borderColor={borderColor}
        as={RouterLink}
        to="/gallery"
        _hover={{
          transform: "scale(1.02)",
          boxShadow: "lg",
          transition: "all 0.2s",
        }}
      >
        <CardBody textAlign="center">
          <Image
            src="gallery-preview.jpg" // Replace with your gallery thumbnail
            alt="Mosque Gallery"
            borderRadius="md"
            mb={3}
            objectFit="cover"
            height="120px"
            width="100%"
          />
          <Heading
            size="md"
            color={useColorModeValue("purple.600", "purple.300")}
          >
            Mosque Gallery
          </Heading>
          <Text fontSize="sm" color={textColor} mt={2}>
            View photos of our mosque
          </Text>
          <Text
            fontSize="xs"
            color={useColorModeValue("gray.500", "gray.400")}
            mt={2}
          >
            {/* {photosCount} photos available 
          </Text>
        </CardBody>
      </Card> */}
      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody
          textAlign="center"
          as={RouterLink}
          to="/gallery"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minH="200px"
        >
          <Icon
            as={FcGallery}
            boxSize={12}
            mb={4}
            color={useColorModeValue("purple.500", "purple.300")}
          />
          <Heading size="md">Photo Gallery</Heading>
          <Text mt={2} color={textColor}>
            Explore mosque construction progress
          </Text>
          <Button mt={4} colorScheme="orange" size="sm" variant="outline">
            View Gallery
          </Button>
        </CardBody>
      </Card>
    </Box>
  );
};

export default SchoolPage;

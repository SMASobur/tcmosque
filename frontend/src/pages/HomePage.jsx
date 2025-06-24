import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);

import { useSchoolStore } from "../store/school";
import { FaDonate } from "react-icons/fa";
import { GiExpense } from "react-icons/gi";
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
      <Heading
        textAlign="center"
        color={useColorModeValue("teal.600", "teal.300")}
        mb={12}
        size={isMobile ? "lg" : "xl"}
      >
        বাইতুন নূর জামে মসজিদ
      </Heading>

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
              ৳{totalDonations.toLocaleString()}
            </Heading>
            <Text
              fontSize="xs"
              color={useColorModeValue("gray.500", "gray.400")}
            >
              {donations.length} transactions
            </Text>
            <Link
              as={RouterLink}
              to="/donations"
              color={useColorModeValue("teal.500", "teal.300")}
              mt={2}
              display="block"
            >
              View Details
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
              ৳{totalExpenses.toLocaleString()}
            </Heading>
            <Text
              fontSize="xs"
              color={useColorModeValue("gray.500", "gray.400")}
            >
              {expenses.length} transactions
            </Text>
            <Link
              as={RouterLink}
              to="/expenses"
              color={useColorModeValue("teal.500", "teal.300")}
              mt={2}
              display="block"
            >
              View Details
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
              ৳{balance.toLocaleString()}
            </Heading>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Financial Charts */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
        {/* Donations vs Expenses Comparison */}
        <Card bg={cardBg} p={4}>
          <Heading
            size="sm"
            mb={4}
            color={useColorModeValue("gray.800", "whiteAlpha.900")}
          >
            Donations vs Expenses
          </Heading>
          <Bar
            data={{
              labels: ["Total"],
              datasets: [
                {
                  label: "Donations",
                  data: [totalDonations],
                  backgroundColor: "#38A169",
                },
                {
                  label: "Expenses",
                  data: [totalExpenses],
                  backgroundColor: "#E53E3E",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: {
                    color: useColorModeValue("#000", "#FFF"),
                  },
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: useColorModeValue("#000", "#FFF"),
                  },
                  grid: {
                    color: useColorModeValue(
                      "rgba(0,0,0,0.1)",
                      "rgba(255,255,255,0.1)"
                    ), // Grid lines
                  },
                },
                y: {
                  ticks: {
                    color: useColorModeValue("#000", "#FFF"),
                  },
                  grid: {
                    color: useColorModeValue(
                      "rgba(0,0,0,0.1)",
                      "rgba(255,255,255,0.1)"
                    ), // Grid lines
                  },
                },
              },
            }}
          />
        </Card>

        {/* Expense Categories */}
        <Card bg={cardBg} p={4}>
          <Heading
            size="sm"
            mb={4}
            color={useColorModeValue("gray.800", "whiteAlpha.900")}
          >
            Expense Categories
          </Heading>
          <Box height="250px">
            <Pie
              data={{
                labels: getExpensesByCategory().map(
                  (item) => item.category.name
                ),
                datasets: [
                  {
                    data: getExpensesByCategory().map((item) => item.total),
                    backgroundColor: [
                      "#DD6B20",
                      "#3182CE",
                      "#805AD5",
                      "#D53F8C",
                      "#0BC5EA",
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right",
                    labels: {
                      color: useColorModeValue("#000", "#FFF"),
                    },
                  },
                },
              }}
            />
          </Box>
        </Card>

        {/* Top 5 Donors */}
        <Card bg={cardBg} p={4} mb={6}>
          <Heading
            size="sm"
            mb={4}
            color={useColorModeValue("gray.800", "whiteAlpha.900")}
          >
            Top 5 Donors
          </Heading>
          <Bar
            data={{
              labels: topDonors.map((item) => item.donor.name),
              datasets: [
                {
                  label: "Amount",
                  data: topDonors.map((item) => item.total),
                  backgroundColor: "#4299E1",
                },
              ],
            }}
            options={{
              indexAxis: "y",
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: useColorModeValue("#000", "#FFF"),
                  },
                },
                y: {
                  ticks: {
                    color: useColorModeValue("#000", "#FFF"),
                  },
                },
              },
            }}
          />
        </Card>
        {/* Most 5 recent donor */}
        <Card
          bg={cardBg}
          border="1px"
          borderColor={borderColor}
          shadow="md"
          p={4}
          mb={6}
        >
          <Heading
            size="sm"
            mb={6}
            color={useColorModeValue("gray.800", "whiteAlpha.900")}
          >
            Recent Donations
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
                    const donor = donors.find((d) => d.id === donation.donorId);
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
                            ৳{donation.amount.toLocaleString()}
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
          {donations.length > 7 && (
            <Link
              as={RouterLink}
              to="/donations"
              color={useColorModeValue("teal.600", "teal.300")}
              mt={2}
              fontWeight="medium"
              fontSize="sm"
              display="block"
              textAlign="right"
              _hover={{
                textDecoration: "underline",
              }}
            >
              View All
            </Link>
          )}
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default SchoolPage;

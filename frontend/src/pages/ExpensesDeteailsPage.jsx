import React, { useState, useEffect, useMemo } from "react";
import { useSchoolStore } from "../store/school";
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
  Input,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
  Card,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

const ExpensesDetailsPage = () => {
  // State hooks
  const [expenseSearch, setExpenseSearch] = useState("");

  // Context hooks
  const { user } = useAuth();
  const { expenses, expenseCategories, fetchAllSchoolData } = useSchoolStore();

  // Style hooks
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.500");
  const cardBg = useColorModeValue("white", "gray.600");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.200", "gray.500");

  useEffect(() => {
    fetchAllSchoolData();
  }, [fetchAllSchoolData]);

  const expensesByCategory = useMemo(() => {
    const filteredCategories = expenseCategories.filter((category) =>
      category.name.toLowerCase().includes(expenseSearch.toLowerCase())
    );

    return filteredCategories.map((category) => {
      const categoryExpenses = expenses.filter(
        (e) => e.category?._id === category._id || e.category === category._id
      );
      const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
      return { category, expenses: categoryExpenses, total };
    });
  }, [expenseCategories, expenses, expenseSearch]);

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  return (
    <Box p={isMobile ? 3 : 5} bg={bgColor} minH="80vh">
      <Heading
        textAlign="center"
        color={useColorModeValue("teal.600", "teal.300")}
        mb={6}
        size={isMobile ? "lg" : "xl"}
      >
        Expense details
      </Heading>

      <Card p="4" bg={cardBg} borderRadius="md" boxShadow="md">
        <Heading size="md" mb={4} color={textColor}>
          Expenses by Category
        </Heading>

        <Input
          placeholder="Search categories..."
          value={expenseSearch}
          onChange={(e) => setExpenseSearch(e.target.value)}
          mb={4}
          bg={cardBg}
          borderColor={borderColor}
          aria-label="Search expense categories"
        />

        <VStack spacing={4} align="stretch">
          {expensesByCategory.map(({ category, expenses, total }) => (
            <Box
              key={category._id}
              border="1px"
              borderColor={borderColor}
              borderRadius="md"
              bg={cardBg}
              p={4}
              boxShadow="md"
            >
              <Heading size="md" mb={2} color={textColor}>
                {category.name}
              </Heading>
              <Heading size="sm" mb={2} color={textColor}>
                Total: ৳ {total.toLocaleString()}
              </Heading>
              {expenses.length > 0 ? (
                <Box overflowX="auto">
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Date</Th>
                        <Th>Description</Th>
                        <Th isNumeric>Amount (৳)</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {expenses.map((expense) => (
                        <Tr key={expense._id}>
                          <Td>{new Date(expense.date).toLocaleDateString()}</Td>
                          <Td>{expense.description}</Td>
                          <Td isNumeric>{expense.amount.toLocaleString()}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              ) : (
                <Text textAlign="center" color="gray.500" py={4}>
                  No expenses found
                </Text>
              )}
            </Box>
          ))}
        </VStack>

        <Text mt="4" textAlign="right" fontWeight="bold" color={textColor}>
          Total Expenses: ৳ {totalExpenses.toLocaleString()}
        </Text>
      </Card>
    </Box>
  );
};

export default ExpensesDetailsPage;

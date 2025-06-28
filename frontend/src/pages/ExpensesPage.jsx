import React, { useState, useEffect } from "react";
import { useSchoolStore } from "../store/school";
import { GiExpense } from "react-icons/gi";
import { MdCategory } from "react-icons/md";
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
import { Link as RouterLink } from "react-router-dom";
import { AddExpenseModal } from "../components/modals/school/AddExpenseModal";
import { AddCategoryModal } from "../components/modals/school/AddCategoryModal";
import { useAuth } from "../context/AuthContext";

const ExpensesPage = () => {
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.500");
  const cardBg = useColorModeValue("white", "gray.600");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.200", "gray.500");
  const linkColor = useColorModeValue("teal.600", "teal.300");
  const linkHoverColor = useColorModeValue("teal.800", "teal.200");

  const {
    expenses,
    expenseCategories,
    fetchAllSchoolData,
    createExpense,
    createCategory,
  } = useSchoolStore();

  const toast = useToast();
  const { user, token } = useAuth();
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [expenseSearch, setExpenseSearch] = useState("");

  const {
    isOpen: isExpenseModalOpen,
    onOpen: onExpenseModalOpen,
    onClose: onExpenseModalClose,
  } = useDisclosure();
  const {
    isOpen: isCategoryModalOpen,
    onOpen: onCategoryModalOpen,
    onClose: onCategoryModalClose,
  } = useDisclosure();

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    fetchAllSchoolData();
  }, []);

  const addNewCategory = async () => {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) return;

    const isDuplicate = expenseCategories.some(
      (category) => category.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      toast({
        title: "Duplicate Category",
        description: "A category with this name already exists.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const result = await createCategory(trimmedName, token);

    if (result.success) {
      toast({
        title: "Category Added",
        description: `${trimmedName} has been successfully added.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setNewCategoryName("");
      onCategoryModalClose();
      await fetchAllSchoolData();
    } else {
      alert(result.message || "Failed to create category.");
    }
  };

  const addExpense = async () => {
    if (!expenseDesc || selectedCategoryId === "" || isNaN(expenseAmount)) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields including category",
        status: "error",
      });
      return;
    }

    try {
      const result = await createExpense(
        {
          description: expenseDesc,
          amount: parseFloat(expenseAmount),
          date: expenseDate,
          category: selectedCategoryId,
          createdBy: {
            id: user?._id,
            name: user?.name,
          },
        },
        token
      );

      if (result.success) {
        toast({
          title: "Expense added.",
          description: "Expense recorded successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setExpenseDesc("");
        setExpenseAmount("");
        setExpenseDate(new Date().toISOString().split("T")[0]);
        setSelectedCategoryId("");
        onExpenseModalClose();
        await fetchAllSchoolData();
      } else {
        alert(result.message || "Failed to add expense");
      }
    } catch (error) {
      console.error("Expense error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add expense",
        status: "error",
      });
    }
  };

  const getExpensesByCategory = () => {
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
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Box p={isMobile ? 3 : 5} bg={bgColor} minH="80vh">
      <Heading
        textAlign="center"
        color={useColorModeValue("teal.600", "teal.300")}
        mb={6}
        size={isMobile ? "lg" : "xl"}
      >
        Expense Management
      </Heading>

      {/* Summary Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} mb={6}>
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
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody textAlign="center">
            <Icon as={MdCategory} w="2em" h="2em" />
            <Text fontSize="sm" color={textColor} mt={2}>
              Total Categories
            </Text>
            <Heading size="md" color="teal.500">
              {expenseCategories.length}
            </Heading>
            <Text
              fontSize="xs"
              color={useColorModeValue("gray.500", "gray.400")}
            >
              Expense categories
            </Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Expenses Table */}
      <Box p="4" bg={cardBg} borderRadius="md" boxShadow="md">
        <Button
          as={RouterLink}
          to="/expenses-details"
          colorScheme="teal"
          size="md"
          mt={4}
        >
          Details
        </Button>
        {(user?.role === "admin" || user?.role === "superadmin") && (
          // <Flex justifyContent="center" gap={4} mb={8}>
          //   <Button
          //     colorScheme="red"
          //     onClick={onExpenseModalOpen}
          //     rightIcon={<span>Add Expense</span>}
          //   >
          //     <GiExpense />
          //   </Button>

          //   <Button
          //     variant="outline"
          //     colorScheme="orange"
          //     onClick={onCategoryModalOpen}
          //     rightIcon={<span>Add Category</span>}
          //   >
          //     <MdCategory />
          //   </Button>
          // </Flex>
          <Flex justify="flex-end" gap={4} mb={4}>
            <Button
              colorScheme="teal"
              onClick={onCategoryModalOpen}
              leftIcon={<MdCategory />}
            >
              Add Category
            </Button>
            <Button
              colorScheme="red"
              onClick={onExpenseModalOpen}
              leftIcon={<GiExpense />}
            >
              Add Expense
            </Button>
          </Flex>
        )}
        <Heading size="md" mb={4} color={textColor}>
          Expenses by Category
        </Heading>
        <Box mb={4}>
          <Input
            placeholder="Search categories..."
            value={expenseSearch}
            onChange={(e) => setExpenseSearch(e.target.value)}
            mb={4}
            bg={cardBg}
            borderColor={borderColor}
          />
        </Box>

        <Box overflowX="auto">
          <Table
            size="sm"
            variant="striped"
            colorScheme={colorMode === "light" ? "red" : "gray"}
          >
            <Thead>
              <Tr>
                <Th color={textColor}>Category</Th>
                <Th isNumeric color={textColor}>
                  Total
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {getExpensesByCategory().map(({ category, total }) => (
                <Tr key={category._id}>
                  <Td color={textColor}>
                    <Link
                      href={`/categories/${category._id}`}
                      color={linkColor}
                      fontWeight="medium"
                      textDecoration="underline"
                      _hover={{
                        color: linkHoverColor,
                        textDecoration: "underline",
                      }}
                    >
                      {category.name}
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
          Total Expenses: ৳{totalExpenses.toLocaleString()}
        </Text>
      </Box>

      {/* Modals */}
      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={onCategoryModalClose}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        addNewCategory={addNewCategory}
      />

      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={onExpenseModalClose}
        expenseCategories={expenseCategories}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        expenseDesc={expenseDesc}
        setExpenseDesc={setExpenseDesc}
        expenseAmount={expenseAmount}
        setExpenseAmount={setExpenseAmount}
        expenseDate={expenseDate}
        setExpenseDate={setExpenseDate}
        addExpense={addExpense}
      />
    </Box>
  );
};

export default ExpensesPage;

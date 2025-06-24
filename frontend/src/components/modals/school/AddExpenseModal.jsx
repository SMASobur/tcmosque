import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  SimpleGrid,
  useColorModeValue,
  FormErrorMessage,
} from "@chakra-ui/react";
import Select from "react-select";
import { useState } from "react";
export const AddExpenseModal = ({
  isOpen,
  onClose,
  expenseCategories,
  selectedCategoryId,
  setSelectedCategoryId,
  expenseDesc,
  setExpenseDesc,
  expenseAmount,
  setExpenseAmount,
  expenseDate,
  setExpenseDate,
  addExpense,
}) => {
  const cardBg = useColorModeValue("white", "gray.600");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.200", "gray.500");
  const [amountError, setAmountError] = useState("");

  const isFormValid = () => {
    return (
      selectedCategoryId &&
      expenseDate &&
      expenseDesc &&
      expenseAmount &&
      !amountError &&
      parseFloat(expenseAmount) >= 1 &&
      parseFloat(expenseAmount) <= 5000000
    );
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setExpenseAmount(value);

    // Validate amount
    if (value === "") {
      setAmountError("Amount is required");
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setAmountError("Please enter a valid number");
    } else if (numValue < 1) {
      setAmountError("Amount must be at least 1");
    } else if (numValue > 5000000) {
      setAmountError("Amount cannot exceed 5,000,000");
    } else {
      setAmountError("");
    }
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      addExpense();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={cardBg}>
        <ModalHeader color={textColor}>Add New Expense</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={1} spacing={4}>
            <FormControl isRequired>
              <FormLabel color={textColor}>Date</FormLabel>
              <Input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                bg={cardBg}
                borderColor={borderColor}
                isRequired
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={textColor}>Category</FormLabel>
              <Select
                options={expenseCategories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                }))}
                placeholder="Select category"
                value={
                  expenseCategories.find((c) => c.id === selectedCategoryId)
                    ? {
                        value: selectedCategoryId,
                        label: expenseCategories.find(
                          (c) => c.id === selectedCategoryId
                        ).name,
                      }
                    : null
                }
                onChange={(selected) => setSelectedCategoryId(selected?.value)}
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: cardBg,
                    borderColor: borderColor,
                    color: useColorModeValue("#000000", "#FFFFFF"),
                  }),
                  singleValue: (base) => ({
                    ...base,

                    color: textColor,
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: useColorModeValue("#FFFFFF", "#A0AEC0"),
                    color: useColorModeValue("#000000", "#FFFFFF"),
                    zIndex: 9999,
                  }),
                  input: (base) => ({
                    ...base,
                    color: useColorModeValue("#000000", "#FFFFFF"),
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused
                      ? useColorModeValue("#E2E8F0", "#2C5282")
                      : "transparent",
                    color: useColorModeValue("#1A202C", "#FFFFFF"),
                    cursor: "pointer",
                  }),
                }}
              />
            </FormControl>

            <FormControl isRequired isInvalid={!!amountError}>
              <FormLabel color={textColor}>Amount (৳)</FormLabel>
              <Input
                type="number"
                value={expenseAmount}
                onChange={handleAmountChange}
                bg={cardBg}
                borderColor={borderColor}
                min="1"
                max="5000000"
                step="0.01"
                isRequired
              />
              <FormErrorMessage>{amountError}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={textColor}>Description</FormLabel>
              <Input
                value={expenseDesc}
                onChange={(e) => setExpenseDesc(e.target.value)}
                bg={cardBg}
                borderColor={borderColor}
                isRequired
              />
            </FormControl>
          </SimpleGrid>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            onClick={handleSubmit}
            mr={3}
            isDisabled={!isFormValid()}
          >
            Add Expense
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

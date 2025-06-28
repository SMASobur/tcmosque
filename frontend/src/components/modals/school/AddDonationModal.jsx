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
  Text,
} from "@chakra-ui/react";
import Select from "react-select";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
export const AddDonationModal = ({
  isOpen,
  onClose,
  donorOptions,
  selectedDonorId,
  setSelectedDonorId,
  donationAmount,
  setDonationAmount,
  DonorMedium,
  setDonorMedium,
  donationDate,
  setDonationDate,
  addDonation,
}) => {
  const cardBg = useColorModeValue("white", "gray.600");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.200", "gray.500");
  const [amountError, setAmountError] = useState("");
  const { user } = useAuth();

  const isFormValid = () => {
    return (
      selectedDonorId &&
      donationDate &&
      DonorMedium &&
      donationAmount &&
      !amountError &&
      parseFloat(donationAmount) >= 1 &&
      parseFloat(donationAmount) <= 5000000
    );
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setDonationAmount(value);

    // Validate amount
    if (value === "") {
      setAmountError("Amount is required");
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setAmountError("Please enter a valid number");
    } else if (numValue < 1) {
      setAmountError("Amount cannot be negative or 0");
    } else if (numValue > 5000000) {
      setAmountError("Amount cannot exceed 5,000,000");
    } else {
      setAmountError("");
    }
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      addDonation();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={cardBg}>
        <ModalHeader color={textColor}>Add New Donation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={1} spacing={4}>
            <FormControl isRequired>
              <FormLabel color={textColor}>Date</FormLabel>
              <Input
                type="date"
                value={donationDate}
                onChange={(e) => setDonationDate(e.target.value)}
                bg={cardBg}
                borderColor={borderColor}
                isRequired
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={textColor}>Select Donor</FormLabel>
              <Select
                options={donorOptions}
                placeholder="Select donor"
                value={
                  donorOptions.find(
                    (option) => option.value === selectedDonorId
                  ) || null
                }
                onChange={(selectedOption) =>
                  setSelectedDonorId(
                    selectedOption ? selectedOption.value : null
                  )
                }
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
                      ? useColorModeValue("#E2E8F0", "#2C5282") // Hover color
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
                value={donationAmount}
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
              <FormLabel color={textColor}>Medium</FormLabel>
              <Input
                type="text"
                value={DonorMedium}
                onChange={(e) => setDonorMedium(e.target.value)}
                bg={cardBg}
                borderColor={borderColor}
                isRequired
              />
            </FormControl>
            <FormControl mt={4}>
              <Text
                px={3}
                py={2}
                bg="gray.200"
                border="1px solid #E2E8F0"
                borderRadius="md"
              >
                Creating by: {user?.name || "Unknown User"}
              </Text>
            </FormControl>
          </SimpleGrid>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            mr={3}
            isDisabled={!isFormValid()}
          >
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

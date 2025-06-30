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
  useToast,
} from "@chakra-ui/react";
import Select from "react-select";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export const EditDonationModal = ({
  isOpen,
  onClose,
  donation,
  donors,
  updateDonation,
  fetchData,
}) => {
  const cardBg = useColorModeValue("white", "gray.600");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.200", "gray.500");
  const { user } = useAuth();
  const toast = useToast();

  // State for form data
  const [formData, setFormData] = useState({
    amount: donation.amount.toString(),
    date: donation.date.split("T")[0],
    medium: donation.medium,
    donorId: donation.donorId,
  });
  const [amountError, setAmountError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prepare donor options for react-select
  const donorOptions = donors.map((donor) => ({
    value: donor._id,
    label: donor.name,
  }));

  const isFormValid = () => {
    return (
      formData.donorId &&
      formData.date &&
      formData.medium &&
      formData.amount &&
      !amountError &&
      parseFloat(formData.amount) >= 1 &&
      parseFloat(formData.amount) <= 5000000
    );
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, amount: value }));

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

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    setIsSubmitting(true);
    try {
      const result = await updateDonation(donation._id, {
        amount: parseFloat(formData.amount),
        date: formData.date,
        medium: formData.medium,
        donorId: formData.donorId,
        updatedBy: {
          id: user?.id,
          name: user?.name,
        },
      });

      if (result.success) {
        toast({
          title: "Donation updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchData();
        onClose();
      } else {
        toast({
          title: "Failed to update donation",
          description: result.message || "Please try again",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error updating donation",
        description: error.message || "An unexpected error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={cardBg}>
        <ModalHeader color={textColor}>Edit Donation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={1} spacing={4}>
            <FormControl isRequired>
              <FormLabel color={textColor}>Date</FormLabel>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                bg={cardBg}
                borderColor={borderColor}
                isRequired
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={textColor}>Donor</FormLabel>
              <Select
                options={donorOptions}
                placeholder="Select donor"
                value={
                  donorOptions.find(
                    (option) => option.value === formData.donorId
                  ) || null
                }
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, donorId: selected?.value }))
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
                value={formData.amount}
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
                value={formData.medium}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, medium: e.target.value }))
                }
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
                Last updated by: {user?.name || "Unknown User"}
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
            isLoading={isSubmitting}
          >
            Save Changes
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

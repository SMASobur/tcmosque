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
  useColorModeValue,
} from "@chakra-ui/react";

export const AddDonorModal = ({
  isOpen,
  onClose,
  newDonorName,
  setNewDonorName,
  addNewDonor,
}) => {
  const cardBg = useColorModeValue("white", "gray.600");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.200", "gray.500");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={cardBg}>
        <ModalHeader color={textColor}>Add New Donor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel color={textColor}>Donor Name</FormLabel>
            <Input
              value={newDonorName}
              onChange={(e) => setNewDonorName(e.target.value)}
              placeholder="Enter donor name"
              bg={cardBg}
              borderColor={borderColor}
              color={textColor}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="orange" onClick={addNewDonor} mr={3}>
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

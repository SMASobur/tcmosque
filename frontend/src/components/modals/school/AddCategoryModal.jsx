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
  Text,
} from "@chakra-ui/react";
import { useAuth } from "../../../context/AuthContext";

export const AddCategoryModal = ({
  isOpen,
  onClose,
  newCategoryName,
  setNewCategoryName,
  addNewCategory,
}) => {
  const { user } = useAuth();
  const cardBg = useColorModeValue("white", "gray.600");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const borderColor = useColorModeValue("gray.200", "gray.500");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={cardBg}>
        <ModalHeader color={textColor}>Add New Category</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel color={textColor}>Category Name</FormLabel>
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              bg={cardBg}
              borderColor={borderColor}
              color={textColor}
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
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="orange" onClick={addNewCategory} mr={3}>
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

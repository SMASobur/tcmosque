import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  VStack,
  FormControl,
  FormLabel,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const CreateProductModal = ({ isOpen, onClose, onCreate }) => {
  const { user } = useAuth();
  const initialRef = useRef(null);
  const toast = useToast();
  const [newProduct, setNewProduct] = useState({
    name: "",
    image: "",
    createdBy: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!newProduct.name || !newProduct.image) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const productWithCreator = {
        ...newProduct,
        createdBy: {
          id: user?._id,
          name: user?.name,
        },
      };

      await onCreate(productWithCreator);

      setNewProduct({ name: "", image: "" });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      toast({
        title: "Success",
        description: "Created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> Add new image</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Image Title</FormLabel>
              <Input
                ref={initialRef}
                name="name"
                value={newProduct.name}
                onChange={handleChange}
                placeholder="Enter image title"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Image URL</FormLabel>
              <Input
                name="image"
                value={newProduct.image}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
            </FormControl>
            <FormControl isRequired mt={7}>
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
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Create
          </Button>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateProductModal;

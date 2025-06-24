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
  useToast,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const StoreEditModal = ({ isOpen, onClose, product, onUpdate, initialRef }) => {
  const { user } = useAuth();
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const toast = useToast();

  const handleSubmit = async () => {
    const isChanged =
      updatedProduct.name !== product.name ||
      updatedProduct.price !== product.price ||
      updatedProduct.image !== product.image;

    if (!isChanged) {
      toast({
        title: "No changes detected",
        description: "You haven't modified any fields.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const productWithEditor = {
        ...updatedProduct,
        updatedBy: {
          id: user?._id || "unknown",
          name: user?.name || "Unknown User",
        },
      };

      await onUpdate(product._id, productWithEditor);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Product</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Input
              ref={initialRef}
              placeholder="Product Name"
              name="name"
              value={updatedProduct.name}
              onChange={(e) =>
                setUpdatedProduct({ ...updatedProduct, name: e.target.value })
              }
            />
            <Input
              placeholder="Price"
              name="price"
              type="number"
              value={updatedProduct.price}
              onChange={(e) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  price: e.target.value,
                })
              }
            />
            <Input
              placeholder="Image URL"
              name="image"
              value={updatedProduct.image}
              onChange={(e) =>
                setUpdatedProduct({
                  ...updatedProduct,
                  image: e.target.value,
                })
              }
            />
            <Text
              px={3}
              py={2}
              bg="gray.200"
              border="1px solid #E2E8F0"
              borderRadius="md"
            >
              Updateing by: {user?.name || "Unknown User"}
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Update
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StoreEditModal;

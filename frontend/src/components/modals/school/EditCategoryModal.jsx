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
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

export const EditCategoryModal = ({
  isOpen,
  onClose,
  category,
  updateCategory,
  fetchData,
}) => {
  const toast = useToast();
  const [name, setName] = useState(category.name);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a category name",
        status: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateCategory(category._id, { name });

      if (result.success) {
        toast({
          title: "Category updated",
          status: "success",
          duration: 3000,
        });
        fetchData();
        onClose();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error updating category",
        description: error.message,
        status: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Category</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Category Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

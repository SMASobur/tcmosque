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

export const EditDonorModal = ({
  isOpen,
  onClose,
  donor,
  updateDonor,
  fetchData,
}) => {
  const toast = useToast();
  const [name, setName] = useState(donor.name);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a donor name",
        status: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateDonor(donor._id, { name });

      if (result.success) {
        toast({
          title: "Donor updated",
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
        title: "Error updating donor",
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
        <ModalHeader>Edit Donor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Donor Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter donor name"
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

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Text,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useProductStore } from "../../store/book.js";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
const OverlayOne = () => (
  <ModalOverlay
    bg="blackAlpha.300"
    backdropFilter="blur(10px) hue-rotate(90deg)"
  />
);

const BookEditModal = ({ book }) => {
  const { user, token } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    publishYear: book.publishYear,
    price: book.price,
  });
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const toast = useToast();
  const { updateProduct } = useProductStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const isChanged =
      formData.title !== book.title ||
      formData.author !== book.author ||
      formData.publishYear !== book.publishYear ||
      formData.price !== book.price;

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
      const updatedData = {
        ...formData,
        updatedBy: {
          id: user?._id || "unknown",
          name: user?.name || "Unknown User",
        },
      };

      const result = await updateProduct(book._id, updatedData, token);

      if (result.success) {
        toast({
          title: "Book updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: "Update failed",
          description: result.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.2, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
      >
        <FiEdit
          onClick={() => {
            setOverlay(<OverlayOne />);
            onOpen();
          }}
          className="text-2xl text-yellow-500 cursor-pointer"
        />
      </motion.div>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        size="md"
      >
        {overlay}
        <ModalContent>
          <Text fontSize="md" mb={2} px={6} py={1}>
            Created by: {book.createdBy?.name || "Unknown user"} ( ID:
            {book.createdBy?.id || "Unknown"})
          </Text>
          <Text fontSize="xl" mb={4} px={6} py={2}>
            ID: {book._id}
          </Text>
          <ModalHeader>Book Name: {book.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Author</FormLabel>
              <Input
                placeholder="Author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Publish Year</FormLabel>
              <Input
                placeholder="Publish Year"
                name="publishYear"
                value={formData.publishYear}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Price</FormLabel>
              <Input
                placeholder="Price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <Text
                px={3}
                py={2}
                bg="gray.200"
                border="1px solid #E2E8F0"
                borderRadius="md"
              >
                Updateing by: {user?.name || "Unknown User"}
              </Text>
            </FormControl>
          </ModalBody>
          <Text color={"red.500"} px={6}>
            * Fields are mandatory.{" "}
          </Text>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
              Update
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BookEditModal;

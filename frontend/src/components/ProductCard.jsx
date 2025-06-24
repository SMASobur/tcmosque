import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Image,
  Link,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useProductStore } from "../store/product";
import StoreEditModal from "./modals/StoreEditModal";
import StoreDeleteModal from "./modals/StoreDeleteModal";
import ProductDetailsModal from "./modals/ProductDetailsModal";

import { useAuth } from "../context/AuthContext";

const ProductCard = ({ product }) => {
  const editModalRef = useRef(null);
  const { user } = useAuth();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure();

  const { deleteProduct, updateProduct } = useProductStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();
  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.700");

  const handleDeleteProduct = async (pid) => {
    setIsDeleting(true);
    try {
      const { success, message } = await deleteProduct(pid);
      toast({
        title: success ? "Success" : "Error",
        description: message,
        status: success ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateProduct = async (pid, updatedProduct) => {
    const { success, message } = await updateProduct(pid, updatedProduct);
    toast({
      title: success ? "Success" : "Error",
      description: success ? "Product updated successfully" : message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      bg={bg}
    >
      <Link onClick={onDetailsOpen}>
        <Image
          src={product.image}
          alt={product.name}
          h={48}
          w="full"
          objectFit="cover"
        />
      </Link>

      <Box p={4}>
        <Heading as="h3" size="md" mb={2}>
          {product.name}
        </Heading>

        <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
          ৳{product.price}
        </Text>
        {user && (
          <HStack spacing={2}>
            <IconButton
              icon={<EditIcon />}
              onClick={onEditOpen}
              colorScheme="blue"
              aria-label="Edit product"
            />
            <IconButton
              icon={<DeleteIcon />}
              onClick={onDeleteOpen}
              colorScheme="red"
              aria-label="Delete product"
            />
          </HStack>
        )}
      </Box>

      <ProductDetailsModal
        isOpen={isDetailsOpen}
        onClose={onDetailsClose}
        product={product}
      />

      <StoreEditModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        product={product}
        onUpdate={handleUpdateProduct}
        initialRef={editModalRef}
      />

      <StoreDeleteModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        product={product}
        onConfirm={handleDeleteProduct}
        isLoading={isDeleting}
      />
    </Box>
  );
};

export default ProductCard;

import {
  Container,
  SimpleGrid,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/product";
import ProductCard from "../components/ProductCard";
import CreateProductModal from "../components/modals/CreateProductModal";

import { useAuth } from "../context/AuthContext";

import React from "react";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

const StoreCardView = () => {
  const { fetchProducts, products, isLoading } = useProductStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { createProduct } = useProductStore();
  const { user } = useAuth();

  const handleCreateProduct = async (productData) => {
    // This will call store's createProduct action
    return await createProduct(productData);
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  console.log("products", products);

  return (
    <Container maxW="container.xl" py={12}>
      <div className="py-4">
        <div className="flex  justify-between items-center">
          <Text
            fontSize={"30"}
            fontWeight={"bold"}
            bgColor="orange.400"
            bgClip={"text"}
            textAlign={"left"}
          >
            Photo Gallery
          </Text>
          {user && (
            <Button
              onClick={onOpen}
              bg={useColorModeValue("green.200", "green.400")}
            >
              <PlusSquareIcon fontSize={20} />
            </Button>
          )}
          <CreateProductModal
            isOpen={isOpen}
            onClose={onClose}
            onCreate={handleCreateProduct}
          />
        </div>
      </div>
      {isLoading ? (
        <Center h="300px">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="orange.400"
            size="xl"
          />
        </Center>
      ) : (
        <VStack spacing={8}>
          <SimpleGrid
            columns={{
              base: 1,
              md: 2,
              lg: 3,
            }}
            spacing={10}
            w={"full"}
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </SimpleGrid>

          {products.length === 0 && (
            <Text
              fontSize="xl"
              textAlign={"center"}
              fontWeight="bold"
              color="gray.500"
            >
              No photos found 😢{" "}
              {user && (
                <Link onClick={onOpen}>
                  <Text
                    as="span"
                    color="blue.500"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Add a photo.
                  </Text>
                </Link>
              )}
            </Text>
          )}
        </VStack>
      )}
    </Container>
  );
};
export default StoreCardView;

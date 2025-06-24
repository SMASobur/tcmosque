import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Heading,
  Image,
  Flex,
  useColorModeValue,
  IconButton,
  Tooltip,
  Box,
  Button,
} from "@chakra-ui/react";
import { FiInfo } from "react-icons/fi";

const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  const textColor = useColorModeValue("gray.600", "gray.200");
  const [showDetails, setShowDetails] = useState(false);
  const handleToggle = () => setShowDetails((prev) => !prev);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Product Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image
            src={product.image}
            alt={product.name}
            h={400}
            w="full"
            objectFit="cover"
          />
          <Heading textAlign="center" p={4} as="h3" size="md" mb={2}>
            {product.name}
          </Heading>
          <Text
            textAlign="center"
            fontWeight="bold"
            fontSize="xl"
            color={textColor}
            mb={4}
          >
            {product.price} :-
          </Text>
          <Box textAlign="center" mb={4}>
            <Text fontWeight="bold" fontSize="xl" color={textColor}>
              {showDetails && (
                <>
                  <strong>Added by: </strong>{" "}
                  {product.createdBy?.name || "Unknown user"}
                  <br />
                  <strong>User ID:</strong> {product.createdBy?.id || "Unknown"}{" "}
                  <br />
                  <strong>Created at:</strong>{" "}
                  {new Date(product.createdAt).toLocaleString("en-SE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}{" "}
                  <br />
                  <strong>Updated by:</strong>{" "}
                  {product.updatedBy?.name || " Not updated yet"} <br />
                  <strong>User ID:</strong> {product.updatedBy?.id || "Unknown"}{" "}
                  <br />
                  <strong>Updated at:</strong>{" "}
                  {new Date(product.updatedAt).toLocaleString("en-SE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",

                    hour12: false,
                  })}{" "}
                </>
              )}
            </Text>
            <Box>
              <Tooltip
                label={showDetails ? "Hide details" : "More details"}
                hasArrow
              >
                <Button
                  onClick={handleToggle}
                  rightIcon={<FiInfo />}
                  size="sm"
                  variant="ghost"
                  mt={2}
                  aria-label="Toggle more details"
                >
                  {showDetails ? "Hide details" : "More details"}
                </Button>
              </Tooltip>
            </Box>
          </Box>
          <Flex
            align="center"
            justify="center"
            fontWeight="bold"
            fontSize="xl"
            color={textColor}
            mb={4}
            gap={2}
            flexWrap="wrap"
          >
            <Text>This is {product.name}</Text>
            <Image
              src={product.image}
              alt={product.name}
              h={10}
              w={10}
              objectFit="cover"
              borderRadius="md"
            />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProductDetailsModal;

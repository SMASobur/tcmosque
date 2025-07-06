import {
  Box,
  Heading,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Image,
  Text,
  useColorModeValue,
  Spinner,
  Flex,
  Button,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { DeleteIcon, PlusSquareIcon } from "@chakra-ui/icons";

const GalleryPage = () => {
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const tabColor = useColorModeValue("orange.500", "orange.200");
  const { user } = useAuth();
  const [processPhotos, setProcessPhotos] = useState([]);
  const [modelImages, setModelImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const cancelRef = useRef();

  const toast = useToast();
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/gallery/${deletingId}`);
      setProcessPhotos((prev) => prev.filter((img) => img._id !== deletingId));
      setModelImages((prev) => prev.filter((img) => img._id !== deletingId));

      toast({
        title: "Deleted",
        description: "Image removed successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error deleting image:", err);
      toast({
        title: "Error",
        description: "Failed to delete image.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDialogOpen(false);
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get("/api/gallery");
        const process = res.data.filter((img) => img.category === "process");
        const models = res.data.filter((img) => img.category === "3d-model");

        setProcessPhotos(process);
        setModelImages(models);
      } catch (err) {
        console.error("Failed to load gallery", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <Box p={4} minH="100vh" bg={bgColor}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="xl" flex="1" textAlign="center">
          Masjid Gallery
        </Heading>
        {user && (
          <Button
            as={RouterLink}
            to="/upload-gallery"
            leftIcon={<PlusSquareIcon boxSize={5} />}
            colorScheme="orange"
            variant="ghost"
            ml={4}
            size="md"
          >
            Add Photo
          </Button>
        )}
      </Flex>

      {loading ? (
        <Box textAlign="center" mt={20}>
          <Spinner size="xl" color="blue.500" />
        </Box>
      ) : (
        <Tabs variant="enclosed" colorScheme="orange">
          <TabList>
            <Tab
              _selected={{
                color: "white",
                bg: tabColor,
                borderColor: useColorModeValue("gray.200", "gray.600"),
              }}
              borderWidth="1px"
              borderBottomWidth="0"
              borderColor={useColorModeValue("gray.200", "gray.600")}
            >
              Construction Process
            </Tab>
            <Tab
              _selected={{
                color: "white",
                bg: tabColor,
                borderColor: useColorModeValue("gray.200", "gray.600"),
              }}
              borderWidth="1px"
              borderBottomWidth="0"
              borderColor={useColorModeValue("gray.200", "gray.600")}
            >
              3D Models
            </Tab>
          </TabList>

          <TabPanels
            borderWidth="1px"
            borderColor={useColorModeValue("gray.200", "gray.600")}
            borderTopWidth="0"
            borderRadius="0 0 8px 8px"
            mt={0}
          >
            <TabPanel p={4}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                {processPhotos.map((photo) => (
                  <Box
                    key={photo._id}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="md"
                    bg={useColorModeValue("white", "gray.800")}
                  >
                    <Image
                      src={photo.imageUrl}
                      alt={photo.caption}
                      objectFit="cover"
                      w="100%"
                      h="300px"
                    />
                    <Flex justify="space-between" align="center" px={4} py={2}>
                      <Text fontWeight="semibold">{photo.caption}</Text>
                      {user && (
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => {
                            setDeletingId(photo._id);
                            setIsDialogOpen(true);
                          }}
                          leftIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      )}
                    </Flex>
                  </Box>
                ))}
              </SimpleGrid>
            </TabPanel>

            <TabPanel p={4}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                {modelImages.map((model) => (
                  <Box
                    key={model._id}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="md"
                    bg={useColorModeValue("white", "gray.800")}
                  >
                    <Image
                      src={model.imageUrl}
                      alt={model.caption}
                      objectFit="cover"
                      w="100%"
                      h="300px"
                    />
                    <Flex justify="space-between" align="center" px={4} py={2}>
                      <Text fontWeight="semibold">{model.caption}</Text>
                      {user && (
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => {
                            setDeletingId(model._id);
                            setIsDialogOpen(true);
                          }}
                          leftIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      )}
                    </Flex>
                  </Box>
                ))}
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}

      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Image
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default GalleryPage;

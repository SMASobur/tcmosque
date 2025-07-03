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
  Link,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { GiRayGun } from "react-icons/gi";

const GalleryPage = () => {
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const tabColor = useColorModeValue("orange.500", "orange.200");
  const { user } = useAuth();
  const [processPhotos, setProcessPhotos] = useState([]);
  const [modelImages, setModelImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get("/api/gallery"); // or your full backend URL
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
        <Heading
          size="xl"
          flex="1"
          textAlign="center"
          color={useColorModeValue("orange.500", "orange.300")}
        >
          Masjid Gallery
        </Heading>
        {user && (
          <IconButton
            as={RouterLink}
            to="/upload-gallery"
            aria-label="Upload to gallery"
            icon={<PlusSquareIcon boxSize={6} />}
            variant="ghost"
            color={useColorModeValue("orange.500", "orange.300")}
            ml={4} // Add some spacing between heading and icon
          />
        )}
      </Flex>

      {loading ? (
        <Box textAlign="center" mt={20}>
          <Spinner size="xl" color="blue.500" />
        </Box>
      ) : (
        <Tabs variant="soft-rounded" align="center">
          <TabList>
            <Tab _selected={{ color: "white", bg: tabColor }} mx={2}>
              Construction Process
            </Tab>
            <Tab _selected={{ color: "white", bg: tabColor }} mx={2}>
              3D Models
            </Tab>
          </TabList>

          <TabPanels mt={6}>
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                {processPhotos.map((photo) => (
                  <Box
                    key={photo._id}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="md"
                  >
                    <Image
                      src={photo.imageUrl}
                      alt={photo.caption}
                      objectFit="cover"
                      w="100%"
                      h="300px"
                    />
                    <Box p={4}>
                      <Text fontWeight="semibold">{photo.caption}</Text>
                    </Box>
                  </Box>
                ))}
              </SimpleGrid>
            </TabPanel>

            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                {modelImages.map((model) => (
                  <Box
                    key={model._id}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="md"
                  >
                    <Image
                      src={model.imageUrl}
                      alt={model.caption}
                      objectFit="cover"
                      w="100%"
                      h="300px"
                    />
                    <Box p={4}>
                      <Text fontWeight="semibold">{model.caption}</Text>
                    </Box>
                  </Box>
                ))}
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

export default GalleryPage;

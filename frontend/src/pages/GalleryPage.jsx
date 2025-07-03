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
} from "@chakra-ui/react";

const GalleryPage = () => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const tabColor = useColorModeValue("blue.500", "blue.200");

  // Sample data - replace with your actual images
  const processPhotos = [
    { id: 1, src: "fav.png", caption: "Construction Phase 1" },
    { id: 2, src: "fav1.png", caption: "Foundation Work" },
    { id: 2, src: "fav1.png", caption: "Foundation Work" },

    // Add more process photos
  ];

  const modelImages = [
    { id: 1, src: "fav.png", caption: "3D Front View" },
    { id: 2, src: "fav1.png", caption: "Aerial Perspective" },
    { id: 1, src: "fav.png", caption: "3D Front View" },
    // Add more 3D images
  ];

  return (
    <Box p={4} minH="100vh" bg={bgColor}>
      <Heading textAlign="center" mb={8} size="xl">
        Masjid Gallery
      </Heading>

      <Tabs variant="soft-rounded" colorScheme="blue" align="center">
        <TabList>
          <Tab _selected={{ color: "white", bg: tabColor }} mx={2}>
            Construction Process
          </Tab>
          <Tab _selected={{ color: "white", bg: tabColor }} mx={2}>
            3D Models
          </Tab>
        </TabList>

        <TabPanels mt={6}>
          {/* Process Photos Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {processPhotos.map((photo) => (
                <Box
                  key={photo.id}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="md"
                >
                  <Image
                    src={photo.src}
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

          {/* 3D Images Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {modelImages.map((model) => (
                <Box
                  key={model.id}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="md"
                >
                  <Image
                    src={model.src}
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
    </Box>
  );
};

export default GalleryPage;

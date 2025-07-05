import {
  AbsoluteCenter,
  Box,
  Card,
  Container,
  Divider,
  Heading,
  Highlight,
  Image,
  Spinner,
  Text,
  Tooltip,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const AboutPage = () => {
  const bgHighlight = useColorModeValue("green.200", "green.300");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const cardBg = useColorModeValue("gray.50", "gray.700");

  const [tcImage, setTcImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTcImpactImage = async () => {
      try {
        const res = await axios.get("/api/gallery");
        const tcImpactImg = res.data.find(
          (img) => img.caption === "TC Impact Logo"
        );
        setTcImage(tcImpactImg);
      } catch (err) {
        console.error("Error fetching TC Impact image:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTcImpactImage();
  }, []);

  return (
    <Container maxW="container.md" py={10} px={6}>
      {/* Section Title */}
      <Box position="relative" py={8}>
        <Divider />
        <AbsoluteCenter px={4}>
          <Heading size="lg">About</Heading>
        </AbsoluteCenter>
      </Box>

      {/* Developer Card */}
      <Card
        p={6}
        borderWidth="1px"
        borderRadius="lg"
        shadow="md"
        bg={cardBg}
        mb={12}
      >
        <Heading size="md" mb={3} display="flex" alignItems="center" gap={2}>
          👨‍💻 Developer
        </Heading>

        <VStack spacing={2} align="start">
          <Tooltip label="Full Name" fontSize="md">
            <Text fontSize="lg" fontWeight="semibold">
              Md Abdus Sobur Sikdar
            </Text>
          </Tooltip>
          {/* Made by */}
          <Box textAlign="center" mb={2}>
            <Highlight
              query="KnitNox"
              styles={{ px: 2, py: 1, rounded: "full", bg: bgHighlight }}
            >
              Founder: KnitNox
            </Highlight>
          </Box>

          <Text fontSize="md" color={textColor}>
            ☎️ +46 738 752 094
          </Text>

          <Text fontSize="md" color={textColor}>
            📧 mdabdussobursikdar@gmail.com
          </Text>

          <Text fontSize="md" color={textColor}>
            📬 Norrköping, Sweden
          </Text>
        </VStack>
      </Card>

      {/* TC Impact Section */}
      <Box textAlign="center">
        {loading ? (
          <Spinner size="lg" />
        ) : tcImage ? (
          <>
            <Image
              src={tcImage.imageUrl}
              alt={tcImage.caption}
              boxSize={{ base: "200px", md: "220px" }}
              mx="auto"
              mb={4}
              filter="drop-shadow(0 5px 8px rgba(2500, 0, 0, 0.8))"
            />

            <Card p={6} borderWidth="1px" borderRadius="lg" bg={cardBg}>
              <Text fontSize="md" color={textColor}>
                This project is generously supported and funded by{" "}
                <strong>TC Impact</strong>, helping to make a meaningful
                contribution to the local community and create impactful
                infrastructure.
              </Text>
            </Card>
          </>
        ) : (
          <Text color="red.400" fontSize="md">
            ⚠️ TC Impact image not found in the database.
          </Text>
        )}
      </Box>
    </Container>
  );
};

export default AboutPage;
